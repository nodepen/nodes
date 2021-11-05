import React from 'react'
import getConfig from 'next/config'

import { ApolloProvider, ApolloClient, InMemoryCache, ApolloLink, concat, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { getMainDefinition } from '@apollo/client/utilities'

type ApolloContextProps = {
  children?: JSX.Element
  token?: string
}

const { publicRuntimeConfig } = getConfig()

const host = 'localhost'
// const host = '192.168.0.235'

export const ApolloContext = ({ children, token }: ApolloContextProps): React.ReactElement => {
  // console.log({ publicRuntimeConfig })

  const wsLink =
    process.browser && token
      ? new WebSocketLink({
          uri: publicRuntimeConfig?.apiEndpoint?.replace('https', 'wss') ?? `ws://${host}:4000/graphql`,
          options: {
            reconnect: true,
            connectionParams: {
              authorization: token,
            },
          },
        })
      : null

  const batchHttpLink = new BatchHttpLink({
    uri: publicRuntimeConfig?.apiEndpoint ?? `http://${host}:4000/graphql`,
    batchInterval: 25,
    batchMax: 50,
  })

  const splitLink = process.browser
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        },
        wsLink ?? batchHttpLink,
        batchHttpLink
      )
    : batchHttpLink

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization: token,
      },
    })

    return forward(operation)
  })

  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    credentials: 'include',
    link: concat(authLink, splitLink),
    cache: new InMemoryCache({ addTypename: false }),
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
