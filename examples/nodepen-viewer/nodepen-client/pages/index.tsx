import type { NextPage } from 'next'
import { Nodes } from '@nodepen/nodes'

const Home: NextPage = () => {
  return (
    <div className="w-vw h-vh flex justify-center items-center">
      <div className="relative" style={{ width: 1000, height: 750, overflow: 'visible' }}>
        <div
          className="absolute"
          style={{ width: 1000, height: 750, top: 0, left: 0, zIndex: 20, pointerEvents: 'none' }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-2 h-2 bg-red-200 rounded-full" />
          </div>
        </div>
        <div className="absolute" style={{ width: 1000, height: 750, top: 0, left: 0, zIndex: 10 }}>
          <Nodes />
        </div>
      </div>
    </div>
  )
}

export default Home
