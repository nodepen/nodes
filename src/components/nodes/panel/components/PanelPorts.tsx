import React from 'react'
import type * as NodePen from '@/types'
import PanelPort from './PanelPort'
import { getPanelPortTemplate } from '@/utils/templates/getGenericParameterDefinition'

type PanelPortsProps = {
    node: NodePen.DocumentNode
    template: NodePen.NodeTemplate
}

export const PanelPorts = ({ node, template }: PanelPortsProps) => {
    const { instanceId: id } = node

    return (
        <>
            <PanelPort nodeInstanceId={id} portInstanceId='input' template={getPanelPortTemplate(template, 'input')} />
            <PanelPort nodeInstanceId={id} portInstanceId='output' template={getPanelPortTemplate(template, 'output')} />
        </>
    )
}