import type { NextPage } from 'next'
import { nodes, NodePen } from '@nodepen/nodes'

const Home: NextPage = () => {
  console.log(nodes)

  return (
    <>
      <div>{nodes}</div>
      <NodePen />
    </>
  )
}

export default Home
