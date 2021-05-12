import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionManager } from '~/context/session'

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'

import '../styles/tailwind.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const client = new ApolloClient({
    link: new BatchHttpLink({
      uri: process.env.NEXT_PUBLIC_NP_API_URL ?? 'http://localhost:4000/graphql',
      batchInterval: 25,
      batchMax: 50,
    }),
    cache: new InMemoryCache({ addTypename: false }),
  })

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>nodepen</title>
        <meta
          name="description"
          content="NodePen is a web client for Grasshopper, the visual programming language for Rhino 3D. Same Grasshopper, new digs. Powered by Rhino
          Compute."
        />
        <meta name="keywords" content="grasshopper, online grasshopper, rhino, rhino.compute, rhino compute" />
      </Head>
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
          -webkit-user-select: none;
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
