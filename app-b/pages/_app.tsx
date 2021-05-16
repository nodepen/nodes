import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '$'

import 'tailwindcss/tailwind.css'

const NodePen = ({ Component, pageProps }: AppProps): React.ReactElement => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default NodePen
