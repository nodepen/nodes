import React from 'react'
import type { AppProps } from 'next/app'

import '../styles/tailwind.css'
import '../styles/fonts.css'

const MyApp = ({ Component, pageProps }: AppProps): React.ReactNode => {
  return <Component {...pageProps} />
}

export default MyApp
