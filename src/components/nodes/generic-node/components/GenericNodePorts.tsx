import React from 'react'
import type * as NodePen from '@/types'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import GenericNodePort from './GenericNodePort'
import { GenericNodePortChip } from './GenericNodePortChip'
import { getFallbackPortTemplate } from '@/utils/templates/getGenericParameterDefinition'

type GenericNodePortsProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const GenericNodePorts = ({ node, template }: GenericNodePortsProps) => {
    const { instanceId: id, inputs, outputs } = node

    const nodeType = getNodeTypeForTemplate(template)

    return (
        <>
            {Object.entries(inputs).map(([inputPortInstanceId, order], i) => (
                <React.Fragment key={`generic-node-input-port-${inputPortInstanceId}`}>
                    <GenericNodePort
                        nodeInstanceId={id}
                        portInstanceId={inputPortInstanceId}
                        template={template.inputs[order] ?? getFallbackPortTemplate(template, 'input', order)}
                        nodeType={nodeType}
                    />
                    <GenericNodePortChip
                        nodeInstanceId={id}
                        portInstanceId={inputPortInstanceId}
                        portDirection='input'
                        portOperation='add'
                    />
                    <GenericNodePortChip
                        nodeInstanceId={id}
                        portInstanceId={inputPortInstanceId}
                        portDirection='input'
                        portOperation='remove'
                    />
                    {i === Object.keys(inputs).length - 1 ? (
                        <GenericNodePortChip
                            nodeInstanceId={id}
                            portInstanceId={inputPortInstanceId}
                            portDirection='input'
                            portOperation='add'
                            isLast
                        />
                    ) : null}
                </React.Fragment>
            ))}
            {Object.entries(outputs).map(([outputPortInstanceId, order], i) => (
                <React.Fragment key={`generic-node-output-port-${outputPortInstanceId}`}>
                    <GenericNodePort
                        nodeInstanceId={id}
                        portInstanceId={outputPortInstanceId}
                        template={template.outputs[order] ?? getFallbackPortTemplate(template, 'output', i)}
                        nodeType={nodeType}
                    />
                    <GenericNodePortChip
                        nodeInstanceId={id}
                        portInstanceId={outputPortInstanceId}
                        portDirection='output'
                        portOperation='add'
                    />
                    <GenericNodePortChip
                        nodeInstanceId={id}
                        portInstanceId={outputPortInstanceId}
                        portDirection='output'
                        portOperation='remove'
                    />
                    {i === Object.keys(outputs).length - 1 ? (
                        <GenericNodePortChip
                            nodeInstanceId={id}
                            portInstanceId={outputPortInstanceId}
                            portDirection='output'
                            portOperation='add'
                            isLast
                        />
                    ) : null}
                </React.Fragment>
            ))}
        </>
    )
}
