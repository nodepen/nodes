import React from 'react'
import type * as NodePen from '@/types'
import GenericParameterPort from './GenericParameterPort'
import { getGenericParameterPortTemplate } from '@/utils/templates/getGenericParameterDefinition'
import { useStore } from '$'

type GenericParameterPortsProps = {
    node: NodePen.DocumentNode
}

export const GenericParameterPorts = ({ node }: GenericParameterPortsProps) => {
    const { instanceId: id } = node

    const template = useStore.getState().templates[node.templateId]

    return (
        <>
            <GenericParameterPort nodeInstanceId={id} portInstanceId='input' template={getGenericParameterPortTemplate(template, 'input')} />
            <GenericParameterPort nodeInstanceId={id} portInstanceId='output' template={getGenericParameterPortTemplate(template, 'output')} />
        </>
    )
}
