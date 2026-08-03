import React, { useCallback } from 'react'
import type * as NodePen from '@/types'
import { useStore } from '$'
import { COLORS } from '@/constants'
import { PortTypeIcon } from '@/components/icons'
import { useNodeInternalState } from '../context/node-state'

type GenericParameterIconProps = {
    node: NodePen.DocumentNode,
    template: NodePen.NodeTemplate
}

export const GenericParameterIcon = ({ node }: GenericParameterIconProps) => {
    const { position } = useNodeInternalState()

    const { x, y } = position

    // TODO: Get icon based on template type
    // const icon = getParameterIcon()

    return <PortTypeIcon position={{ x: x + 9, y: y + 6 }} />
}