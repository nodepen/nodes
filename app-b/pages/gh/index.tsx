import { NextPage } from 'next'
import { Layout } from 'features/common'
import { Graph } from 'features'

const GrasshopperEditor: NextPage = () => {
  return (
    <Layout.Editor>
      <Graph.Container />
    </Layout.Editor>
  )
}

export default GrasshopperEditor
