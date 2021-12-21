import type { AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '$'

import 'tailwindcss/tailwind.css'
import { SessionManager } from '@/features/common/context/session'

const NodePen = ({ Component, pageProps }: AppProps): React.ReactElement => {
  return (
    <ReduxProvider store={store}>
      <SessionManager>
        <Component {...pageProps} />
      </SessionManager>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Nova+Mono&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Nova+Mono&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@300;400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@100;200;300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

        html,
        body {
          color: #333333;
        }

        button:focus:not(:focus-visible) {
          outline: none;
        }

        input:focus:not(:focus-visible) {
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
    </ReduxProvider>
  )
}

export default NodePen
