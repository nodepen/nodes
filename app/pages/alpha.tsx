import React from 'react'
import { NextPage } from 'next'
import { Layout, Graph } from '@/components'

const AlphaPage: NextPage = () => {
  return (
    <Layout.Root>
      <Graph.Container />
    </Layout.Root>
  )
}

export default AlphaPage
