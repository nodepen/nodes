import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import nookies from 'nookies'
import Head from 'next/head'
import { HomePageLanding, HomePageDashboard } from '@/features/home'
import { useSessionManager } from '@/features/common/context/session'
import { ApolloContext } from '@/features/common/context/apollo'

type HomePageProps = {
  userExpected: boolean
}

const Home: NextPage<HomePageProps> = ({ userExpected }) => {
  const { token, user } = useSessionManager()

  const showDashboard = (user && !user.isAnonymous) || userExpected

  const content = showDashboard ? <HomePageDashboard /> : <HomePageLanding />

  return (
    <>
      <Head>
        <title>NodePen</title>
        <meta
          name="description"
          content="NodePen is a web client for Grasshopper, the visual programming language for Rhino 3D. Same Grasshopper, new digs. Powered by Rhino
          Compute."
        />
        <meta name="keywords" content="grasshopper, grasshopper online, grasshopper 3d" />
        <meta name="theme-color" content="#98E2C6" />
      </Head>
      <ApolloContext token={token}>{content}</ApolloContext>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (ctx) => {
  const { token } = nookies.get(ctx, { path: '/' })

  return {
    props: {
      userExpected: !!token,
    },
  }
}
