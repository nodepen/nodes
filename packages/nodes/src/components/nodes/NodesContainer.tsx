import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { shallow } from 'zustand/shallow'
import { getNodeType } from '@/utils/templates'

import { GenericNode } from './generic-node'
import { Panel } from './panel'

const NodesContainer = (): React.ReactElement => {
  const nodes = useDocumentNodes()
  const templates = useStore((store) => store.templates, shallow)

  return (
    <g id="np-nodes" className="np-pointer-events-auto">
      {nodes.map((node) => {
        const { instanceId, templateId } = node

        const template = templates[templateId]

        switch (getNodeType(template)) {
          case 'generic-node':
            return <GenericNode key={`generic-node-${instanceId}`} id={instanceId} template={template} />
          case 'panel':
            return <Panel key={`panel-${instanceId}`} nodeInstanceId={instanceId} nodeTemplate={template} />
          default:
            console.log(`🐍 Could not render node of type \`${getNodeType(template)}\``)
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

type NodePenNodeType = 'generic-node' | 'generic-parameter' | 'unknown'

const getNodeTypeForTemplate = (template?: NodePen.NodeTemplate): NodePenNodeType => {
  if (!template) {
    return 'unknown'
  }

  switch (template.category) {
    case 'params': {
      return 'generic-parameter'
    }
    default: {
      return 'generic-node'
    }
  }
}

export default React.memo(NodesContainer)
