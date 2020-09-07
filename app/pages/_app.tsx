import type { AppProps } from 'next/app'
import '../styles/tailwind.css'
import '../styles/fonts.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default MyApp