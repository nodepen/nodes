import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { Layout } from 'features/common'
import { Graph } from 'features'
import { GraphManager } from '@/features/graph/context/graph'
import { KeyboardObserver } from 'features/common/observer'
import { ApolloContext } from '@/features/common/context/apollo'
import { useSessionManager } from '@/features/common/context/session'

const GrasshopperEditor: NextPage = () => {
  const { token } = useSessionManager()

  return (
    <>
      <Head>
        <script defer src="https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"></script>
      </Head>
      <ApolloContext token={token}>
        <Layout.Editor>
          <GraphManager>
            <Graph.Container />
          </GraphManager>
        </Layout.Editor>
      </ApolloContext>
      <KeyboardObserver />
    </>
  )
}

export default GrasshopperEditor

/**
 * Opt out of server-side static generation.
 * TODO: Pre-fetch graph, if it exists
 */
export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} }
}
