import React from 'react'
import type { AppProps } from 'next/app'
import { SessionManager } from '~/context/session'
import { GraphManager } from '~/context/graph'

import '../styles/tailwind.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionManager>
      <GraphManager>
        <Component {...pageProps} />
      </GraphManager>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Nova+Mono&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Nova+Mono&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@300;400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@100;200;300;400;500;600;700;800;900&display=swap')

        html,
        body {
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </SessionManager>
  )
}

export default MyApp
