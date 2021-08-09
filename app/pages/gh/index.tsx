import { NextPage } from 'next'
import Head from 'next/head'
import { Layout } from 'features/common'
import { Graph } from 'features'
import { GraphManager } from 'context/graph'
import { SessionManager } from 'context/session'
import { KeyboardObserver } from 'features/common/observer'

const GrasshopperEditor: NextPage = () => {
  return (
    <>
      <Head>
        <script defer src="https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"></script>
      </Head>
      <SessionManager>
        <Layout.Editor>
          <GraphManager>
            <Graph.Container />
          </GraphManager>
        </Layout.Editor>
      </SessionManager>
      <KeyboardObserver />
    </>
  )
}

export default GrasshopperEditor
