import React from 'react'
import { NextPage } from 'next'
import { Layout, Queue } from '@/components'
import { GraphManager } from '@/context/graph'

const AlphaQueuePage: NextPage = () => {
  return (
    <Layout.Root>
      <GraphManager>
        <Queue.Container />
      </GraphManager>
    </Layout.Root>
  )
}

export default AlphaQueuePage
