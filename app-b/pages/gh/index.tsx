import { NextPage } from 'next'
import Head from 'next/head'
import { Layout } from 'features/common'
import { Graph } from 'features'
import { GraphManager } from 'context/graph'

const GrasshopperEditor: NextPage = () => {
  return (
    <>
      <Head>
        <script defer src="https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"></script>
      </Head>
      <Layout.Editor>
        <GraphManager>
          <Graph.Container />
        </GraphManager>
      </Layout.Editor>
    </>
  )
}

export default GrasshopperEditor
