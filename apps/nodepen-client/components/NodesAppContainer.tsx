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

  const callbacks: NodesAppCallbacks = {
    onDocumentChange: handleDocumentChange,
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
