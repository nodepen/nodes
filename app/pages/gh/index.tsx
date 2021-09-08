import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { Layout } from 'features/common'
import { Graph } from 'features'
import { GraphManager } from '@/features/graph/context/graph'
import { SessionManager } from '@/features/common/context/session'
import { KeyboardObserver } from 'features/common/observer'
import { ApolloContext } from '@/features/common/context/apollo'

const GrasshopperEditor: NextPage = () => {
  return (
    <>
      <Head>
        <script defer src="https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"></script>
      </Head>
      <ApolloContext>
        <SessionManager>
          <Layout.Editor>
            <GraphManager>
              <Graph.Container />
            </GraphManager>
          </Layout.Editor>
        </SessionManager>
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
