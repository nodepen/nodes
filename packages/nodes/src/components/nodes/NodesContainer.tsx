import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import shallow from 'zustand/shallow'

import { GenericNode } from './generic-node'

const NodesContainer = (): React.ReactElement => {
  const nodes = useDocumentNodes()
  const templates = useStore((store) => store.templates, shallow)

  return (
    <g id="np-nodes" className="np-pointer-events-auto">
      {nodes.map((node) => {
        // Handle special templates (number slider, panel, etc)
        const { instanceId, templateId } = node

        const template = templates[templateId]

        switch (getNodeTypeForTemplate(template)) {
          case 'generic-component':
            return <GenericNode key={`generic-node-${instanceId}`} id={instanceId} template={template} />
          case 'generic-parameter':
            return null
          case 'unknown':
            // TODO: `unknown-node` type
            return null
        }
      })}
    </g>
  )
}

const useDocumentNodes = (): NodePen.DocumentNode[] => {
  const nodes = useStore<NodePen.Document['nodes']>(
    (store) => store.document.nodes,
    (previousNodes, currentNodes) => {
      const previousNodeIds = Object.keys(previousNodes)
      const currentNodeIds = Object.keys(currentNodes)

      const isSameLength = () => previousNodeIds.length === currentNodeIds.length
      const isSameValues = () => previousNodeIds.every((id) => currentNodeIds.includes(id))

      return isSameLength() && isSameValues()
    }
  )

  return Object.values(nodes)
}

type NodePenNodeType = 'generic-component' | 'generic-parameter' | 'unknown'

const getNodeTypeForTemplate = (template?: NodePen.NodeTemplate): NodePenNodeType => {
  if (!template) {
    return 'unknown'
  }

  switch (template.category) {
    case 'params': {
      return 'generic-parameter'
    }
    default: {
      return 'generic-component'
    }
  }
}

export default React.memo(NodesContainer)
