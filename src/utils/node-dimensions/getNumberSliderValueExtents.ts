import { useNodeInternalState } from '@/components/nodes/context/node-state'
import { DIMENSIONS } from '@/constants'
import type * as NodePen from '@/types'

type NodeExtents = {
    x: number
    y: number
    width: number
    height: number
}

const {
    NODE_INTERNAL_PADDING,
    NUMBER_SLIDER_VALUE_WIDTH,
    NUMBER_SLIDER_HEIGHT,
} = DIMENSIONS

export const useNumberSliderValuePosition = (nodePosition: NodePen.DocumentNode['position']): NodeExtents => {
    return {
        x: nodePosition.x + NODE_INTERNAL_PADDING,
        y: nodePosition.y + NODE_INTERNAL_PADDING,
        width: NUMBER_SLIDER_VALUE_WIDTH,
        height: NUMBER_SLIDER_HEIGHT - NODE_INTERNAL_PADDING * 2 - 1,
    }
}