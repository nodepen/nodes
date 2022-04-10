import type { NextPage } from 'next'
import { Nodes } from '@nodepen/nodes'

const Home: NextPage = () => {
  return (
    <div className="w-vw h-vh flex justify-center items-center">
      <div style={{ width: 1000, height: 750, outline: '1px solid red' }}>
        <Nodes />
      </div>
    </div>
  )
}

export default Home
