import type { NextApiRequest, NextApiResponse } from 'next'
import { ApolloClient, createHttpLink, InMemoryCache, gql, ApolloError } from '@apollo/client'
import { admin } from 'features/common/context/session/auth'
import nookies from 'nookies'

type CurrentUserRecord = {
  username: string
  limits: {
    ms: number
  }
  usage: {
    ms: number
  }
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<CurrentUserRecord | ApolloError | string>
): Promise<unknown> => {
  const { token } = nookies.get({ req }, { path: '/' })

  if (!token) {
    res.status(401).send('This is not a public endpoint.')
    return
  }

  const tokenResult = await admin.auth().verifyIdToken(token)
  const currentUser = await admin.auth().getUser(tokenResult.uid)

  if (currentUser.providerData.length === 0) {
    res.status(401).send('Cannot fetch information for anonymous users.')
    return
  }

  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: process?.env?.NEXT_PUBLIC_NP_API_ENDPOINT ?? 'http://localhost:4000/graphql',
      credentials: 'same-origin',
      headers: {
        authorization: token,
      },
    }),
    cache: new InMemoryCache(),
  })

  const { data, error } = await client.query({
    query: gql`
      query GetCurrentUser {
        currentUser {
          username
          usage {
            ms
          }
          limits {
            ms
          }
        }
      }
    `,
  })

  if (error) {
    res.status(400).json(error)
    return
  }

  res.status(200).json(data.currentUser)
}
