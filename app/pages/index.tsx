import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import { HomePageContainer } from '@/features/home'

const Home: NextPage = () => {
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
      <HomePageContainer />
    </>
  )
}

export default Home
