import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import getConfig from 'next/config'
import { ApolloClient, createHttpLink, InMemoryCache, gql } from '@apollo/client'
import nookies from 'nookies'
import { Layout } from 'features/common'
import { Graph } from 'features'
import { GraphManager } from '@/features/graph/context/graph'
import { SolutionManager } from 'features/graph/context/solution'
import { KeyboardObserver } from 'features/common/observer'
import { ApolloContext } from '@/features/common/context/apollo'
import { useSessionManager } from '@/features/common/context/session'
import { GrasshopperGraphManifest } from '@/features/graph/types'
import { newGuid } from '@/features/graph/utils'

type NewGrasshopperEditorPageProps = {
  manifest: GrasshopperGraphManifest
}

const NewGrasshopperEditor: NextPage<NewGrasshopperEditorPageProps> = ({ manifest }) => {
  const { token } = useSessionManager()

  const Scene = dynamic(() => import('features/graph/components/scene/SceneContainer'))

  return (
    <>
      <Head>
        <script defer src="https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"></script>
      </Head>
      <ApolloContext token={token}>
        <Layout.Editor>
          <GraphManager manifest={manifest}>
            <SolutionManager>
              <>
                <Graph.Container />
                <Scene />
              </>
            </SolutionManager>
          </GraphManager>
        </Layout.Editor>
      </ApolloContext>
      <KeyboardObserver />
    </>
  )
}

export default NewGrasshopperEditor

const { publicRuntimeConfig } = getConfig()

export const getServerSideProps: GetServerSideProps<NewGrasshopperEditorPageProps> = async (ctx) => {
  const { id } = ctx.query

  const cookie = nookies.get(ctx)

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

  const { data } = await client.query({
    query: gql`
      query GetCurrentGraph($graphId: String!) {
        solution(graphId: $graphId) {
          files {
            json
          }
        }
      }
    `,
    variables: {
      graphId: id,
    },
  })

  const elements = JSON.parse(data?.solution?.files?.json ?? '{}')

  return {
    props: {
      manifest: {
        id: newGuid(),
        name: 'Twisty Tower',
        author: 'anonymous',
        elements,
      },
    },
  }
}
