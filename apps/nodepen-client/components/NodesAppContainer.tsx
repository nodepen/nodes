'use client'

import type React from 'react'
import { useCallback } from 'react'
import type * as NodePen from '@nodepen/core'
import { NodesApp, DocumentView, SpeckleModelView } from '@nodepen/nodes'

type NodesAppContainerProps = {
  document: NodePen.Document
  templates: NodePen.NodeTemplate[]
}

const NodesAppContainer = ({ document, templates }: NodesAppContainerProps): React.ReactElement => {
  const streamId = ''

  const handleDocumentChange = useCallback((document: NodePen.Document) => {
    console.log('Callback from app!')
  }, [])

  const callbacks = {
    onChange: handleDocumentChange,
  }

  return (
    <NodesApp document={document} templates={templates} {...callbacks}>
      <DocumentView editable />
      {/* <SpeckleModelView streamId={streamId} /> */}
    </NodesApp>
  )
}

export default NodesAppContainer
