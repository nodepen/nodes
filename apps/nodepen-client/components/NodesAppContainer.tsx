'use client'

import type React from 'react'
import { useCallback, useState } from 'react'
import type * as NodePen from '@nodepen/core'
import { NodesApp, DocumentView, SpeckleModelView } from '@nodepen/nodes'
import type { NodesAppState, NodesAppCallbacks } from '@nodepen/nodes'

type NodesAppContainerProps = {
  document: NodePen.Document
  templates: NodePen.NodeTemplate[]
}

const NodesAppContainer = ({ document: initialDocument, templates }: NodesAppContainerProps): React.ReactElement => {
  const streamId = ''

  const [document, setDocument] = useState(initialDocument)
  const [solution, setSolution] = useState<NodePen.SolutionData>()

  const handleDocumentChange = useCallback((state: NodesAppState): void => {
    console.log('Callback from app!')
  }, [])

  const handleFileUpload = useCallback(async (state: NodesAppState): Promise<void> => {
    const file = state.layout.fileUpload.activeFile

    if (!file) {
      return
    }

    const body = new FormData()
    body.append('file', file)

    const payload = { method: 'POST', body }

    const response = await fetch('http://localhost:6500/files/gh', payload)
    const data = await response.json()

    console.log(data)

    setDocument(data)
  }, [])

  const handleExpireSolution = useCallback((state: NodesAppState): void => {
    const solutionId = state.solution.id
    const userValues: { [portRef: string]: number } = {}

    for (const node of Object.values(state.document.nodes)) {
      const { instanceId, values } = node

      for (const [portId, dataTree] of Object.entries(values)) {
        const value = dataTree?.['{0}']?.[0]

        if (!value) {
          continue
        }

        if (value.type === 'number' || value.type === 'integer') {
          userValues[`${instanceId}:${portId}`] = value.value
        }
      }
    }

    const fetchSolution = async (): Promise<{ id: string; streamObjectIds: string[] }> => {
      const response = await fetch('http://localhost:6500/grasshopper/id/solution', {
        method: 'POST',
        body: JSON.stringify({ solutionId, userValues }),
      })
      const data = await response.json()

      return data
    }

    fetchSolution()
      .then((data) => {
        console.log(data)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  const callbacks: NodesAppCallbacks = {
    onDocumentChange: handleDocumentChange,
    onExpireSolution: handleExpireSolution,
    onFileUpload: handleFileUpload,
  }

  return (
    <NodesApp document={document} templates={templates} {...callbacks}>
      <DocumentView editable />
      <SpeckleModelView streamId={streamId} />
    </NodesApp>
  )
}

export default NodesAppContainer
