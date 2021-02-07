import React from 'react'
import { NextPage } from 'next'
import { Layout, Queue } from '@/components'

const AlphaQueuePage: NextPage = () => {
  return (
    <Layout.Root>
      <Queue.Container />
    </Layout.Root>
  )
}

export default AlphaQueuePage
