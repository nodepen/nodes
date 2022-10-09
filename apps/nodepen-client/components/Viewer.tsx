import React from 'react'
import { NodesApp } from '@nodepen/nodes'
import { useQuery } from '@tanstack/react-query'

const Viewer = (): React.ReactElement => {
  const { error, data } = useQuery(['grasshopper'], () =>
    fetch('http://localhost:6500/grasshopper').then((res) => res.json())
  )

  // console.log(error)
  // console.log(data)

  return (
    <NodesApp
      document={{ id: '', nodes: {}, configuration: { pinnedPorts: [] }, version: 1 }}
      templates={data}
      stream={{ id: '', objects: [] }}
    />
  )
}

export default Viewer
