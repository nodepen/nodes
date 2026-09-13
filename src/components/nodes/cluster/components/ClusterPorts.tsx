import React from 'react'
import type * as NodePen from '@/types'
import GenericNodePort from '../../generic-node/components/GenericNodePort'
import { getPortTemplateFromConfiguration } from '@/utils/ports/getPortTemplateFromConfiguration'

type ClusterPortsProps = {
    node: NodePen.DocumentNode
}

export const ClusterPorts = ({ node }: ClusterPortsProps) => {
    const { instanceId: id, inputs, outputs } = node

    return (
        <>
            {Object.keys(inputs).map((inputPortInstanceId) => {
                const template = getPortTemplateFromConfiguration(node, inputPortInstanceId, 'input')

                if (!template) {
                    return null
                }

                return (
                    <GenericNodePort
                        key={`cluster-input-port-${inputPortInstanceId}`}
                        nodeInstanceId={id}
                        portInstanceId={inputPortInstanceId}
                        template={template}
                        nodeType="generic-node"
                    />
                )
            })}
            {Object.keys(outputs).map((outputPortInstanceId) => {
                const template = getPortTemplateFromConfiguration(node, outputPortInstanceId, 'output')

                if (!template) {
                    return null
                }

                return (
                    <GenericNodePort
                        key={`cluster-output-port-${outputPortInstanceId}`}
                        nodeInstanceId={id}
                        portInstanceId={outputPortInstanceId}
                        template={template}
                        nodeType="generic-node"
                    />
                )
            })}
        </>
    )
}
