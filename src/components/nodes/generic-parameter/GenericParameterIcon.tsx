import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { COLORS } from '@/constants'
import { PortTypeIcon } from '@/components/icons'
import { useNodeInternalState } from '../context/node-state'
import { getGenericParameterPortTemplate } from '@/utils/templates/getGenericParameterDefinition'

type GenericParameterIconProps = {
    node: NodePen.DocumentNode,
    template: NodePen.NodeTemplate
}

export const GenericParameterIcon = ({ node, template }: GenericParameterIconProps) => {
    const { position } = useNodeInternalState()

    const { typeName } = getGenericParameterPortTemplate(template, 'input')

    const { x, y } = position

    return <PortTypeIcon position={{ x: x + 11, y: y + 6 }} typeName={typeName as NodePen.DataTreeValueType} />
}