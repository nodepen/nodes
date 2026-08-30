import React from 'react'
import type * as NodePen from '@/types'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import GenericNodePort from './GenericNodePort'

type GenericNodePortsProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericNodePorts = ({ node, template }: GenericNodePortsProps) => {
    const { instanceId: id, inputs, outputs } = node

    const nodeType = getNodeTypeForTemplate(template)

    return (
        <>
            {Object.entries(inputs).map(([inputPortInstanceId, order]) => (
                <GenericNodePort
                    key={`generic-node-input-port-${inputPortInstanceId}`}
                    nodeInstanceId={id}
                    portInstanceId={inputPortInstanceId}
                    template={template.inputs[order]}
                    nodeType={nodeType}
                />
            ))}
            {Object.entries(outputs).map(([outputPortInstanceId, order]) => (
                <GenericNodePort
                    key={`generic-node-output-port-${outputPortInstanceId}`}
                    nodeInstanceId={id}
                    portInstanceId={outputPortInstanceId}
                    template={template.outputs[order]}
                    nodeType={nodeType}
                />
            ))}
        </>
    )
}
