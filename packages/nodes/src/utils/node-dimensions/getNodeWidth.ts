import type * as NodePen from '@nodepen/core'
import { DIMENSIONS } from '@/constants'

const { NODE_INTERNAL_PADDING, NODE_LABEL_WIDTH, NODE_PORT_MINIMUM_WIDTH } = DIMENSIONS

export const getNodeWidth = (): number => {
    return NODE_INTERNAL_PADDING * 4 + NODE_PORT_MINIMUM_WIDTH * 2 + NODE_LABEL_WIDTH
}