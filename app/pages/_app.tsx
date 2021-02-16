import React from 'react'
import type { AppProps } from 'next/app'
import { SessionManager } from '~/context/session'

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

import '../styles/tailwind.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_NP_API_URL ?? 'http://localhost:4000/graphql',
    cache: new InMemoryCache({ addTypename: false }),
  })

  return (
    <ApolloProvider client={client}>
      <SessionManager>
        <Component {...pageProps} />
      </SessionManager>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Nova+Mono&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Nova+Mono&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@300;400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@100;200;300;400;500;600;700;800;900&display=swap');

        html,
        body {
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        * {
          touch-action: none;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        * {
          box-sizing: border-box;
        }

        button:focus:not(:focus-visible) {
          outline: none;
        }
      `}</style>
    </ApolloProvider>
  )
}

export default MyApp
