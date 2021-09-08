import React from 'react'
import getConfig from 'next/config'

/* eslint-disable */
import { ApolloProvider, ApolloClient, InMemoryCache, ApolloLink, concat, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { BatchHttpLink } from '@apollo/client/link/batch-http'

import nookies from 'nookies'

import { getMainDefinition } from '@apollo/client/utilities'
/* eslint-enable */

type ApolloContextProps = {
  children?: JSX.Element
}

const { publicRuntimeConfig } = getConfig()

export const ApolloContext = ({ children }: ApolloContextProps): React.ReactElement => {
  // const wsLink = process.browser
  //   ? new WebSocketLink({
  //       uri: process.env.NEXT_PUBLIC_NP_API_URL?.replace('https', 'wss') ?? 'ws://localhost:4000/graphql',
  //       options: {
  //         reconnect: true,
  //         connectionParams: {
  //           authorization: nookies.get(undefined)['token'],
  //         },
  //       },
  //     })
  //   : null

  console.log({ publicRuntimeConfig })

  const batchHttpLink = new BatchHttpLink({
    uri: publicRuntimeConfig?.apiEndpoint ?? 'http://localhost:4000/graphql',
    batchInterval: 25,
    batchMax: 50,
  })

  // const splitLink = process.browser
  //   ? split(
  //       ({ query }) => {
  //         const definition = getMainDefinition(query)
  //         return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  //       },
  //       wsLink ?? batchHttpLink,
  //       batchHttpLink
  //     )
  //   : batchHttpLink

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization: nookies.get(undefined)['token'],
      },
    })

    return forward(operation)
  })

  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    credentials: 'include',
    link: concat(authLink, batchHttpLink),
    cache: new InMemoryCache({ addTypename: false }),
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
