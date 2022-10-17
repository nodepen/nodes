import React, { useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { NodesApp } from '@nodepen/nodes'
import { useQuery } from '@tanstack/react-query'

const Viewer = (): React.ReactElement => {
  const { error, data } = useQuery(['grasshopper'], () =>
    fetch('http://localhost:6500/grasshopper').then((res) => res.json())
  )

  const handleDocumentChange = useCallback((document: NodePen.Document) => {
    console.log('Correct callback!')
    console.log(document)
    fetch('http://localhost:6500/grasshopper/id', { method: 'POST', body: JSON.stringify(document) })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        console.log('Result:')
        console.log(data)
      })
  }, [])

  return (
    <NodesApp
      document={{ id: '', nodes: {}, configuration: { pinnedPorts: [] }, version: 1 }}
      templates={data}
      stream={{ id: '', objects: [] }}
      onChange={handleDocumentChange}
    />
  )
}

export default Viewer
