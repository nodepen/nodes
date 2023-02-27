import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { useDebugRender, useDraggableNode } from '../hooks'
import { GenericNodeBody, GenericNodeLabel, GenericNodePorts, GenericNodeShadow, GenericNodeSkeleton, GenericNodeWires } from './components'

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

  return (
    <>
      <g id={`generic-node-${id}`} ref={draggableTargetRef}>
        {node.status.isProvisional ? (
          <>
            <GenericNodeSkeleton node={node} template={template} />
          </>
        ) : (
          <>
            <GenericNodeShadow node={node} template={template} />
            <GenericNodeBody node={node} template={template} />
            <GenericNodeLabel node={node} template={template} />
            <GenericNodePorts node={node} template={template} />
          </>
        )}
      </g>
      <GenericNodeWires node={node} />
    </>
  )
}

const propsAreEqual = (prevProps: Readonly<GenericNodeProps>, nextProps: Readonly<GenericNodeProps>): boolean => {
  return prevProps.id === nextProps.id
}

export default React.memo(GenericNode, propsAreEqual)
