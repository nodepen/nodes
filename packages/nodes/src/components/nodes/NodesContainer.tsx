import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'

import { GenericNode } from './generic-node'

const NodesContainer = (): React.ReactElement => {
  // TODO: Pull from state in a smart way
  const nodes = useDocumentNodes()

  return (
    <g id="np-nodes" className="np-pointer-events-auto">
      {nodes.map((node) => {
        // Handle special templates (number slider, panel, etc)
        const { id, template } = node

        switch (template) {
          case 'some-id':
            return null
          default:
            return <GenericNode key={`generic-node-${id}`} id={id} />
        }
      })}
    </g>
  )
}

const useDocumentNodes = (): NodePen.Element[] => {
  const nodes = useStore<NodePen.Document['elements']>(
    (store) => store.document.elements,
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
