import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '$'
import { SessionManager } from 'context/session'

import 'tailwindcss/tailwind.css'

const NodePen = ({ Component, pageProps }: AppProps): React.ReactElement => {
  return (
    <Provider store={store}>
      <SessionManager>
        <Component {...pageProps} />
      </SessionManager>
    </Provider>
  )
}

export default NodePen
