import type { AppProps } from 'next/app'

import 'tailwindcss/tailwind.css'

const NodePen = ({ Component, pageProps }: AppProps): React.ReactElement => {
  return <Component {...pageProps} />
}

export default NodePen
