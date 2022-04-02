import type { NextPage } from 'next'
import { Nodes } from '@nodepen/nodes'

const Home: NextPage = () => {
  return (
    <div className="w-vw h-vh overflow-hidden">
      <Nodes />
    </div>
  )
}

export default Home
