import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { useDebugRender, useDraggableNode, useSelectableNode } from '../hooks'
import {
  GenericNodeBody,
  GenericNodePorts,
  GenericNodeRuntimeMessage,
  GenericNodeShadow,
  GenericNodeSkeleton,
  GenericNodeWires,
} from './components'

type GenericNodeProps = {
  id: string
  template: NodePen.NodeTemplate
}

/**
 * Renders most common node types with a static number of inputs and outputs.
 */
const GenericNode = ({ id, template }: GenericNodeProps): React.ReactElement => {
  // Subscribe to current node state
  const node = useStore((store) => store.document.nodes[id])

  // Attach debug behaviors
  useDebugRender(node, template)

  // Attach interactive behaviors
  const draggableTargetRef = useDraggableNode(id)
  const selectableTargetRef = useSelectableNode(id)

  return (
    <>
      <g id={`generic-node-${id}`} ref={draggableTargetRef}>
        <g ref={selectableTargetRef}>
          {node.status.isProvisional ? (
            <>
              <GenericNodeSkeleton node={node} template={template} />
            </>
          ) : (
            <>
              <GenericNodeRuntimeMessage node={node} />
              <GenericNodeShadow node={node} template={template} />
              <GenericNodeBody node={node} template={template} />
              <GenericNodePorts node={node} template={template} />
            </>
          )}
        </g>
      </g>
      <GenericNodeWires node={node} />
    </>
  )
}

const propsAreEqual = (prevProps: Readonly<GenericNodeProps>, nextProps: Readonly<GenericNodeProps>): boolean => {
  return prevProps.id === nextProps.id
}

export default React.memo(GenericNode, propsAreEqual)
