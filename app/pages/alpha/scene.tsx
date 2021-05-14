import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import { Grasshopper } from 'glib'
import { Layout, Scene } from '@/components'
import { GraphManager } from '~/context/graph'
import { SceneManager } from '@/components/scene/lib/context'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { COMPUTE_CONFIGURATION } from '@/queries'

type ScenePageProps = {
  config: Grasshopper.Component[]
}

const AlphaScenePage: NextPage<ScenePageProps> = ({ config }) => {
  return (
    <Layout.Root>
      <Head>
        <title>nodepen: scene viewer</title>
        <meta name="description" content="The scene viewer for NodePen. View the 3D results of the current graph." />
      </Head>
      <GraphManager config={config}>
        <SceneManager>
          <Scene.Container />
        </SceneManager>
      </GraphManager>
    </Layout.Root>
  )
}

export default AlphaScenePage

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
