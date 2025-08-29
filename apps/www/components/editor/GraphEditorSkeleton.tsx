"use client"

import type * as NodePen from '@nodepen/core'
import { DocumentView, NodesApp } from '@nodepen/nodes'
import { useMemo } from 'react'

const GraphEditorSkeleton = () => {
  const fallbackDocument: NodePen.Document = useMemo(() => ({
    id: '',
    version: 1,
    nodes: {},
    meta: {
      name: 'My Document',
      speckle: {
        linkedModel: {
          id: '',
          name: '',
          rootObjectId: undefined
        }
      }
    },
    configuration: {
      inputs: [],
      outputs: []
    }
  }), [])
  return (
    <NodesApp document={fallbackDocument} templates={[]}>
      <DocumentView editable />
    </NodesApp>
  )
}

export default GraphEditorSkeleton