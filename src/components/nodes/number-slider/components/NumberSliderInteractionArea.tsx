import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useDispatch } from '@/store'
import React, { useCallback } from 'react'
import { useNodeInternalState } from '../../context/node-state'

type InteractionAreaProps = {
    node: NodePen.DocumentNode
}

const { INTERACTION_BUFFER } = DIMENSIONS

export const NumberSliderInteractionArea = ({ node }: InteractionAreaProps) => {
    const { position } = useNodeInternalState()

    const { x, y } = position
    const { width, height } = node.dimensions

    return (
        <rect style={{ pointerEvents: 'all' }} x={x - INTERACTION_BUFFER} y={y - INTERACTION_BUFFER - 12} width={width + INTERACTION_BUFFER * 2} height={height + 12 + INTERACTION_BUFFER * 2} fill="transparent" />
    )
}