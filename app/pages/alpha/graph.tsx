import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import { Grasshopper } from 'glib'
import { Layout, Graph } from '@/components'
import { GraphManager } from '~/context/graph'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { COMPUTE_CONFIGURATION } from '@/queries'

type GraphPageProps = {
  config: Grasshopper.Component[]
}

const AlphaGraphPage: NextPage<GraphPageProps> = ({ config }) => {
  return (
    <Layout.Root>
      <GraphManager config={config}>
        <Graph.Container />
      </GraphManager>
    </Layout.Root>
  )
}

export default AlphaGraphPage

export const getStaticProps: GetStaticProps = async () => {
  const client = new ApolloClient({
    ssrMode: true,
    uri: process.env.NEXT_PUBLIC_NP_API_URL ?? 'https://api.dev.nodepen.io/graphql',
    cache: new InMemoryCache(),
  })

  const { data } = await client.query({ query: COMPUTE_CONFIGURATION })

  const installed = data.getComputeConfiguration

  return {
    props: {
      config: installed,
    },
  }
}
