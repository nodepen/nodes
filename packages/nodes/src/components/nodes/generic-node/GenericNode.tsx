import React from 'react'
import type * as NodePen from '@nodepen/core'
import { useStore } from '$'
import { useDraggableNode } from '../hooks'
import { Wire } from '@/components/annotations/wire'
import { GenericNodeBody, GenericNodeLabel, GenericNodePort, GenericNodeShadow } from './components'

type GenericNodeProps = {
  id: string
  template: NodePen.NodeTemplate
}

const GenericNode = ({ id, template }: GenericNodeProps): React.ReactElement => {
  const node = useStore((store) => store.document.nodes[id])

  console.log(`⚙️⚙️⚙️ Rendered generic node [${id.split('-')[0]}] (${template.nickName})`)

  const draggableTargetRef = useDraggableNode(id)

  return (
    <>
      <g id={`generic-node-${id}`} ref={draggableTargetRef}>
        <GenericNodeShadow node={node} template={template} />
        <GenericNodeBody node={node} template={template} />
        <GenericNodeLabel node={node} template={template} />
        {Object.entries(node.inputs).map(([inputPortInstanceId, order]) => (
          <GenericNodePort
            key={`generic-node-input-port-${inputPortInstanceId}`}
            nodeInstanceId={id}
            portInstanceId={inputPortInstanceId}
            template={template.inputs[order]}
          />
        ))}
        {Object.entries(node.outputs).map(([outputPortInstanceId, order]) => (
          <GenericNodePort
            key={`generic-node-output-port-${outputPortInstanceId}`}
            nodeInstanceId={id}
            portInstanceId={outputPortInstanceId}
            template={template.outputs[order]}
          />
        ))}
      </g>
      {Object.entries(node.sources).map(([inputPortInstanceId, sources]) => {
        const currentInput = {
          nodeInstanceId: node.instanceId,
          portInstanceId: inputPortInstanceId,
        }

        return Object.values(sources).map((source) => {
          const wireKey = [
            'np-generic-node-wire',
            source.nodeInstanceId,
            source.portInstanceId,
            currentInput.nodeInstanceId,
            currentInput.portInstanceId,
          ].join('-')

          return <Wire key={wireKey} from={source} to={currentInput} />
        })
      })}
    </>
  )
}

const propsAreEqual = (prevProps: Readonly<GenericNodeProps>, nextProps: Readonly<GenericNodeProps>): boolean => {
  return prevProps.id === nextProps.id
}

export default React.memo(GenericNode, propsAreEqual)
