import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '$'
import { SessionManager } from 'context/session'

/* eslint-disable */
import { ApolloProvider, ApolloClient, InMemoryCache, ApolloLink, concat, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { BatchHttpLink } from '@apollo/client/link/batch-http'

import nookies from 'nookies'

import 'tailwindcss/tailwind.css'
import { getMainDefinition } from '@apollo/client/utilities'
/* eslint-enable */

const NodePen = ({ Component, pageProps }: AppProps): React.ReactElement => {
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

  const batchHttpLink = new BatchHttpLink({
    uri: process.env.NEXT_PUBLIC_NP_API_URL ?? 'http://localhost:4000/graphql',
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

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <SessionManager>
          <Component {...pageProps} />
        </SessionManager>
      </ApolloProvider>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Nova+Mono&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Nova+Mono&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@300;400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@100;200;300;400;500;600;700;800;900&display=swap');

        html,
        body {
          color: #333333;
        }

        button:focus:not(:focus-visible) {
          outline: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .no-outline {
          outline: none;
        }
      `}</style>
    </Provider>
  )
}

export default NodePen
