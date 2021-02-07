import React from 'react'
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from 'next'
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { password } = query

  const response: GetServerSidePropsResult<never> = { redirect: { destination: '/teaser', permanent: false } }

  if (!password || password !== process.env.ALPHA_PASSWORD) {
    return response
  }

  return { props: {} }
}
