import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '$'
import { SessionManager } from 'context/session'

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'

import 'tailwindcss/tailwind.css'

const NodePen = ({ Component, pageProps }: AppProps): React.ReactElement => {
  const client = new ApolloClient({
    link: new BatchHttpLink({
      uri: process.env.NEXT_PUBLIC_NP_API_URL ?? 'http://localhost:4000/graphql',
      credentials: 'include',
      batchInterval: 25,
      batchMax: 50,
    }),
    cache: new InMemoryCache({ addTypename: false }),
  })

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <SessionManager>
          <Component {...pageProps} />
        </SessionManager>
      </ApolloProvider>
    </Provider>
  )
}

export default NodePen
