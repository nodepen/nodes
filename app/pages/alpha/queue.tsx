import React from 'react'
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from 'next'
import { Layout, Queue } from '@/components'
import { GraphManager } from '@/context/graph'

const AlphaQueuePage: NextPage = () => {
  return (
    <div className="w-full h-full p-4">
      <Queue.Container />
    </div>
  )
}

export default AlphaQueuePage

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { password } = query

  const response: GetServerSidePropsResult<never> = { redirect: { destination: '/teaser', permanent: false } }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return response
  }

  return { props: {} }
}
