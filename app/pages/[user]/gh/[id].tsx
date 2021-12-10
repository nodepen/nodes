import { GetServerSideProps, NextPage } from 'next'
import { NodePen } from 'glib'
import nookies from 'nookies'
import { ApolloClient, createHttpLink, InMemoryCache, gql } from '@apollo/client'
import getConfig from 'next/config'
import { admin } from '@/features/common/context/session/auth'
import { newGuid } from '../../../features/graph/utils'

type GrasshopperGraphPageProps = Omit<NodePen.GraphManifest, 'files'>

const GrasshopperGraphPage: NextPage<GrasshopperGraphPageProps> = ({ id, name, author, graph }) => {
  return (
    <div>
      <h2>{name}</h2>
      <h3>{author.name}</h3>
      <pre>{JSON.stringify(graph.elements, null, 2)}</pre>
      <pre>{JSON.stringify(graph.solution, null, 2)}</pre>
    </div>
  )
}

export default GrasshopperGraphPage

const { publicRuntimeConfig } = getConfig()

export const getServerSideProps: GetServerSideProps<GrasshopperGraphPageProps> = async (context) => {
  try {
    const cookie = nookies.get(context)

    const { token } = cookie

    // User id for the incoming user
    let currentUserId = 'unset'

    try {
      if (token) {
        const session = await admin.auth().verifyIdToken(token)
        currentUserId = session.uid
      }
    } catch {
      // Invalid token
    }

    const client = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: publicRuntimeConfig?.apiEndpoint ?? 'http://localhost:4000/graphql',
        credentials: 'same-origin',
        headers: {
          authorization: cookie.token,
        },
      }),
      cache: new InMemoryCache(),
    })

    const { data, error } = await client.query({
      query: gql`
        query GetGraphById($id: String!) {
          graph(id: $id) {
            id
            name
            author {
              id
              name
            }
            files {
              graphJson
              graphSolutionJson
            }
          }
        }
      `,
    })

    if (!data || !data.graph || !!error) {
      return { notFound: true }
    }

    const { id, name, author, files } = data.graph as NodePen.GraphManifest

    if (!files.graphJson || !files.graphSolutionJson) {
      return { notFound: true }
    }

    const isOwner = author.id === currentUserId

    const record: Omit<GrasshopperGraphPageProps, 'graph'> = {
      id: isOwner ? id : newGuid(),
      name: name,
      author: {
        id: 'N/A',
        name: author.name,
      },
    }

    const bucket = admin.storage().bucket('np-graphs')
    const validation = process?.env?.NEXT_PUBLIC_DEBUG !== 'true'

    const graphJsonFile = bucket.file(files.graphJson)
    const [graphJson] = await graphJsonFile.download({ validation })

    const graphElements: NodePen.GraphElementsArray = JSON.parse(graphJson.toString())
    const elements: NodePen.GraphElementsMap = graphElements.reduce((all, current) => {
      all[current.id] = current
      return all
    }, {} as NodePen.GraphElementsMap)

    // Probably should defer this to client-side
    const graphSolutionJsonFile = bucket.file(files.graphSolutionJson)
    const [graphSolutionJson] = await graphSolutionJsonFile.download({ validation })

    const solution: NodePen.SolutionManifest = JSON.parse(graphSolutionJson.toString())

    return {
      props: { ...record, graph: { elements, solution } },
    }
  } catch {
    return { notFound: true }
  }
}
