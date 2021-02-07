import React from 'react'
import { NextPage } from 'next'
import { Layout, Scene } from '@/components'
import { GraphManager } from '~/context/graph'

const AlphaScenePage: NextPage = () => {
  return (
    <Layout.Root>
      <GraphManager>
        <Scene.Container />
      </GraphManager>
    </Layout.Root>
  )
}

export default AlphaScenePage
