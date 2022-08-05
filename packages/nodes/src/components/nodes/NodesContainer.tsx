import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'

import { GenericNode } from './generic-node'

const NodesContainer = (): React.ReactElement => {
  const nodes = useDocumentNodes()

  return (
    <g id="np-nodes" className="np-pointer-events-auto">
      {nodes.map((node) => {
        // Handle special templates (number slider, panel, etc)
        const { instanceId, templateId } = node

        switch (templateId) {
          case 'some-id':
            return null
          default:
            return <GenericNode key={`generic-node-${instanceId}`} id={instanceId} />
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

export default React.memo(NodesContainer)
