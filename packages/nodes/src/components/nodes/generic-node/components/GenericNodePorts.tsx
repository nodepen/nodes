import React from 'react'
import type * as NodePen from '@nodepen/core'
import GenericNodePort from './GenericNodePort'

type GenericNodePortsProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericNodePorts = ({ node, template }: GenericNodePortsProps) => {
    const { instanceId: id, inputs, outputs } = node

    return (
        <>
            {Object.entries(inputs).map(([inputPortInstanceId, order]) => (
                <GenericNodePort
                    key={`generic-node-input-port-${inputPortInstanceId}`}
                    nodeInstanceId={id}
                    portInstanceId={inputPortInstanceId}
                    template={template.inputs[order]}
                />
            ))}
            {Object.entries(outputs).map(([outputPortInstanceId, order]) => (
                <GenericNodePort
                    key={`generic-node-output-port-${outputPortInstanceId}`}
                    nodeInstanceId={id}
                    portInstanceId={outputPortInstanceId}
                    template={template.outputs[order]}
                />
            ))}
        </>
    )
}