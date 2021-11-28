import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import nookies from 'nookies'
import Head from 'next/head'
import { HomePageContainer } from '@/features/home'

type HomePageProps = {
  isAuthenticated: boolean
}

const Home: NextPage<HomePageProps> = ({ isAuthenticated }) => {
  const content = isAuthenticated ? null : <HomePageContainer />

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
      {content}
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (ctx) => {
  const defaultProps: HomePageProps = { isAuthenticated: false }

  try {
    const cookie = nookies.get(ctx, { path: '/' })

    if (!cookie.token) {
      return { props: defaultProps }
    }

    return { props: { isAuthenticated: true } }
  } catch (e) {
    console.log(e)
    return { props: defaultProps }
  }
}
