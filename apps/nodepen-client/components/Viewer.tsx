import React, { useCallback, useState } from 'react'
import type * as NodePen from '@nodepen/core'
import { NodesApp, DocumentView, SpeckleModelView } from '@nodepen/nodes'
import { useQuery } from '@tanstack/react-query'

const Viewer = (): React.ReactElement => {
  const { error, data: templates } = useQuery(['grasshopper'], () =>
    fetch('http://localhost:6500/grasshopper').then((res) => res.json())
  )

  const [objectIds, setObjectIds] = useState<string[]>([])

  const handleDocumentChange = useCallback((document: NodePen.Document) => {
    console.log('Correct callback!')
    console.log(document)
    fetch('http://localhost:6500/grasshopper/id', { method: 'POST', body: JSON.stringify(document) })
      .then((res) => {
        return res.text()
      })
      .then((data) => {
        console.log({ speckleCommitId: data })
        return fetch('http://localhost:6500/streams/id/objects')
      })
      .then((res) => {
        return res.text()
      })
      .then((data) => {
        console.log({ speckleObjectId: data })
        setObjectIds([data])
      })
  }, [])

  const document: NodePen.Document = {
    id: 'test-id',
    nodes: {},
    configuration: {
      pinnedPorts: [],
    },
    version: 1,
  }

  const streamId = 'b0d3a3c122'

  const callbacks = {
    onChange: handleDocumentChange,
  }

  return (
    <NodesApp document={document} templates={templates} {...callbacks}>
      <DocumentView editable />
      <SpeckleModelView streamId={streamId} />
    </NodesApp>
  )
}
