import React from 'react'
import { NextPage, GetServerSideProps, GetServerSidePropsResult } from 'next'

const Home: NextPage = () => {
  return <div>Redirecting...</div>
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const response: GetServerSidePropsResult<never> = { redirect: { permanent: false, destination: '/teaser' } }
  return response
}
