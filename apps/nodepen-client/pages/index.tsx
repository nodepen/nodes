import type { NextPage } from 'next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'

const client = new QueryClient()

const NodesApp = dynamic(() => import('../components/Viewer'), {
  ssr: false,
})

const Home: NextPage = () => {
  return (
    <QueryClientProvider client={client}>
      <div className="w-vw h-vh flex justify-center items-center">
        <div className="relative" style={{ width: 1000, height: 750, overflow: 'visible' }}>
          {/* <div
          className="absolute"
          id="app-dot"
          style={{ width: 1000, height: 750, top: 0, left: 0, zIndex: 20, pointerEvents: 'none' }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-2 h-2 bg-red-200 rounded-full" />
          </div>
        </div> */}
          <div className="absolute" style={{ width: 1000, height: 750, top: 0, left: 0, zIndex: 10 }}>
            <NodesApp />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default Home
