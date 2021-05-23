import { NextPage } from 'next'
import { Layout } from 'features/common'
import { Graph } from 'features'
import { GraphManager } from 'context/graph'

const GrasshopperEditor: NextPage = () => {
  return (
    <Layout.Editor>
      <GraphManager>
        <Graph.Container />
      </GraphManager>
    </Layout.Editor>
  )
}

export default GrasshopperEditor
