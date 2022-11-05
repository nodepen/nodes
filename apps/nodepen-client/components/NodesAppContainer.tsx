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

    setDocument(data)
  }, [])

  const handleExpireSolution = useCallback((state: NodesAppState): void => {
    const solutionId = state.solution.id

    const fetchSolution = async (): Promise<NodePen.SolutionData> => {
      const response = await fetch('http://localhost:6500/grasshopper/id/solution', {
        method: 'POST',
        body: JSON.stringify({ solutionId, document: state.document }),
      })

      const data = await response.json()

      return data
    }

    const sanitize = (data: NodePen.SolutionData): NodePen.SolutionData => {
      data.id = solutionId

      for (const nodeData of Object.values(data.values)) {
        for (const portData of Object.values(nodeData)) {
          for (const branchData of Object.values(portData)) {
            for (const dataTreeValue of branchData) {
              const validKeys = ['type', 'value']

              for (const key of Object.keys(dataTreeValue)) {
                if (validKeys.includes(key)) {
                  continue
                }

                const proxy = dataTreeValue as any

                delete proxy[key]
              }
            }
          }
        }
      }

      return data
    }

    fetchSolution()
      .then((data) => {
        const sanitized = sanitize(data)
        console.log(sanitized)
        setSolution(sanitized)
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
    <NodesApp document={document} templates={templates} solution={solution} {...callbacks}>
      <DocumentView editable />
      <SpeckleModelView streamId={streamId} />
    </NodesApp>
  )
}

export default NodesAppContainer
