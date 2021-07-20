import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '$'
import { SessionManager } from 'context/session'

import { ApolloProvider, ApolloClient, InMemoryCache, ApolloLink, concat } from '@apollo/client'
import nookies from 'nookies'
import { BatchHttpLink } from '@apollo/client/link/batch-http'

import 'tailwindcss/tailwind.css'

const NodePen = ({ Component, pageProps }: AppProps): React.ReactElement => {
  const batchHttpLink = new BatchHttpLink({
    uri: process.env.NEXT_PUBLIC_NP_API_URL ?? 'http://192.168.0.211:4000/graphql',
    batchInterval: 25,
    batchMax: 50,
  })

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization: nookies.get(undefined)['token'],
      },
    })

    return forward(operation)
  })

  const client = new ApolloClient({
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
