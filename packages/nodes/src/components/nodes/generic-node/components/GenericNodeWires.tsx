import React from 'react'
import type * as NodePen from '@nodepen/core'
import { PortConnectionWire } from '@/components/annotations/wire'

type GenericNodeWiresProps = {
  node: NodePen.DocumentNode
}

export const GenericNodeWires = ({ node }: GenericNodeWiresProps) => {
  const { sources: nodeSources } = node

  return (
    <>
      {Object.entries(nodeSources).map(([inputPortInstanceId, inputPortSources]) => {
        const currentInput = {
          nodeInstanceId: node.instanceId,
          portInstanceId: inputPortInstanceId,
        }

        return Object.values(inputPortSources).map((source) => {
          const wireKey = [
            'np-generic-node-wire',
            source.nodeInstanceId,
            source.portInstanceId,
            currentInput.nodeInstanceId,
            currentInput.portInstanceId,
          ].join('-')

          return <PortConnectionWire key={wireKey} from={source} to={currentInput} />
        })
      })}
    </>
  )
}
