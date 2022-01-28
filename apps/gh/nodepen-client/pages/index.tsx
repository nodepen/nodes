import type { NextPage } from 'next'
import { nodes } from '@nodepen/nodes'

const Home: NextPage = () => {
  console.log(nodes)

  return <div>{nodes}</div>
}

export default Home
