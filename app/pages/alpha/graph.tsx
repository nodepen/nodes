import React from 'react'
import { NextPage } from 'next'
import { Layout, Graph } from '@/components'
import { GraphManager } from '~/context/graph'

const AlphaGraphPage: NextPage = () => {
  return (
    <Layout.Root>
      <GraphManager>
        <Graph.Container />
      </GraphManager>
    </Layout.Root>
  )
}

export default AlphaGraphPage
