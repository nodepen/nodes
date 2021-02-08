import React from 'react'
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from 'next'
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { password } = query

  const response: GetServerSidePropsResult<never> = { redirect: { destination: '/teaser', permanent: false } }

  if (!password || password !== process.env.ALPHA_PASSWORD) {
    return response
  }

  return { props: {} }
}
