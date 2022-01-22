import React from 'react'
import nookies from 'nookies'
import { NextPage, GetServerSideProps } from 'next'
import { UserProfile } from '@/features/user-profile'
import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client'
import { useSessionManager } from '@/features/common/context/session'
import { ApolloContext } from '@/features/common/context/apollo'
import Head from 'next/head'

type UserProfilePageProps = {
  username: string
  photoUrl?: string
}

const UserProfilePage: NextPage<UserProfilePageProps> = (user) => {
  const { token } = useSessionManager()

  return (
    <ApolloContext token={token}>
      <>
        <Head>
          <title>{user.username}</title>
        </Head>
        <UserProfile username={user.username} photoUrl={user.photoUrl} />
      </>
    </ApolloContext>
  )
}

export const getServerSideProps: GetServerSideProps<UserProfilePageProps> = async (context) => {
  try {
    const { user: username } = context.query

    const cookie = nookies.get(context, { path: '/' })

    const client = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: process?.env?.NEXT_PUBLIC_NP_API_ENDPOINT ?? 'http://localhost:4000/graphql',
        credentials: 'same-origin',
        headers: {
          authorization: cookie.token,
        },
      }),
      cache: new InMemoryCache(),
    })

    const { data, error } = await client.query({
      query: gql`
        query GetPublicUser($username: String!) {
          publicUserByUsername(username: $username) {
            username
            photoUrl
          }
        }
      `,
      variables: {
        username,
      },
    })

    if (!data || !data.publicUserByUsername || !!error) {
      return { notFound: true }
    }

    const user = data.publicUserByUsername

    return { props: user }
  } catch {
    return { notFound: true }
  }
}

export default UserProfilePage
