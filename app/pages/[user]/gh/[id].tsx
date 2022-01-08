import { GetServerSideProps, NextPage } from 'next'
import { NodePen } from 'glib'
import nookies from 'nookies'
import dynamic from 'next/dynamic'
import { Graph } from 'features'
import { GraphManager } from '@/features/graph/context/graph'
import { SolutionManager } from 'features/graph/context/solution'
import Head from 'next/head'
import { ApolloClient, createHttpLink, InMemoryCache, gql } from '@apollo/client'
import { admin } from '@/features/common/context/session/auth'
import { newGuid } from '../../../features/graph/utils'
import { ApolloContext } from '@/features/common/context/apollo'
import { useSessionManager } from '@/features/common/context/session'

import { KeyboardObserver } from 'features/common/observer'

type GrasshopperGraphPageProps = NodePen.GraphManifest

const GrasshopperGraphPage: NextPage<GrasshopperGraphPageProps> = ({ id, name, author, files, graph, stats }) => {
  const { token } = useSessionManager()

  const Scene = dynamic(() => import('features/graph/components/scene/SceneContainer'))

  return (
    <>
      <Head>
        <title>{`${name} by ${author.name}`}</title>
        <script defer src="https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"></script>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cdriesler" />
        <meta name="twitter:title" content={`${name} by ${author.name}`}></meta>
        <meta name="twitter:image" content={files.twitterThumbnailImage}></meta>
      </Head>
      <ApolloContext token={token}>
        <GraphManager manifest={{ id, name, author, graph, files, stats }}>
          <Graph.Editor>
            <SolutionManager initialSolution={files.graphSolutionJson}>
              <>
                <Graph.Container />
                <Scene />
              </>
            </SolutionManager>
          </Graph.Editor>
        </GraphManager>
      </ApolloContext>
      <KeyboardObserver />
    </>
  )
}

export default GrasshopperGraphPage

export const getServerSideProps: GetServerSideProps<GrasshopperGraphPageProps> = async (context) => {
  try {
    const cookie = nookies.get(context, { path: '/' })

    const { token } = cookie

    const { id: graphId } = context.query

    // User id for the incoming user
    let currentUserName = ''

    try {
      if (token) {
        const session = await admin.auth().verifyIdToken(token)
        const user = await admin.auth().getUser(session.uid)
        currentUserName = user.displayName ?? ''
      }
    } catch {
      // Invalid token
    }

    const client = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: process?.env?.NEXT_PUBLIC_NP_API_ENDPOINT ?? 'http://localhost:4000/graphql',
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
          graph(graphId: $id) {
            id
            name
            author {
              name
            }
            files {
              graphJson
              graphSolutionJson
              graphBinaries
              twitterThumbnailImage
            }
            stats {
              views
            }
          }
        }
      `,
      variables: {
        id: graphId,
      },
    })

    if (error) {
      console.log(JSON.stringify(error.clientErrors, null, 3))
      return { notFound: true }
    }

    if (!data || !data.graph) {
      return { notFound: true }
    }

    const { id, name, author, files, stats } = data.graph as NodePen.GraphManifest

    if (!files.graphJson || !files.graphSolutionJson || !files.graphBinaries) {
      return { notFound: true }
    }

    const isOwner = author.name === currentUserName

    const record: Omit<GrasshopperGraphPageProps, 'graph'> = {
      id: isOwner ? id : newGuid(),
      name: name,
      author: {
        id: 'N/A',
        name: author.name,
      },
      files: {
        twitterThumbnailImage: files?.twitterThumbnailImage ?? '',
      },
      stats,
    }

    const bucket = admin.storage().bucket('np-graphs')
    const validation = process?.env?.NEXT_PUBLIC_DEBUG !== 'true'

    const getFileUrl = async (bucketLocation: string): Promise<string> => {
      const file = bucket.file(bucketLocation)
      return process?.env?.NEXT_PUBLIC_DEBUG === 'true'
        ? file.publicUrl()
        : (
            await file.getSignedUrl({
              version: 'v4',
              action: 'read',
              expires: Date.now() + 60 * 60 * 1000,
            })
          )[0]
    }

    // Set graphBinaries and graphSolutionJson url in response
    record.files.graphBinaries = await getFileUrl(files.graphBinaries)
    record.files.graphSolutionJson = await getFileUrl(files.graphSolutionJson)

    // Download and hydrate graph json
    const graphJsonFile = bucket.file(files.graphJson)
    const [graphJson] = await graphJsonFile.download({ validation })

    const graphElements: NodePen.GraphElementsArray = JSON.parse(graphJson.toString())
    const elements: NodePen.GraphElementsMap = graphElements.reduce((all, current) => {
      all[current.id] = current
      return all
    }, {} as NodePen.GraphElementsMap)

    // Probably should defer this to client-side
    // const graphSolutionJsonFile = bucket.file(files.graphSolutionJson)
    // const [graphSolutionJson] = await graphSolutionJsonFile.download({ validation })

    // const solution: NodePen.SolutionManifest = JSON.parse(graphSolutionJson.toString())
    const solution = {} as any

    return {
      props: { ...record, graph: { elements, solution } },
    }
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }
}
