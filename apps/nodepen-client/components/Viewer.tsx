import React from 'react'
import { NodesApp } from '@nodepen/nodes'
import { useQuery } from '@tanstack/react-query'

const Viewer = (): React.ReactElement => {
  const { error, data } = useQuery(['grasshopper'], () =>
    fetch('http://localhost:6500/grasshopper').then((res) => res.json())
  )

  // console.log(error)
  // console.log(data)

  return <NodesApp document={{ id: '', nodes: {}, version: 1 }} templates={data} />
}

export default Viewer
