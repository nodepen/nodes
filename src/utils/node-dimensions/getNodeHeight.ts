import type * as NodePen from '@/types'
import { DIMENSIONS } from '@/constants'

export const getNodeHeight = (
    node: NodePen.DocumentNode,
    template: NodePen.NodeTemplate,
    useIcon = false
): number => {
    const { inputs, outputs } = node
    const { nickName } = template

    const inputPortsHeight = Object.keys(inputs).length * DIMENSIONS.NODE_PORT_HEIGHT
    const outputPortsHeight = Object.keys(outputs).length * DIMENSIONS.NODE_PORT_HEIGHT

    const minimumLabelHeight = useIcon ? 24 : nickName.length * 15 // not monospace, estimate

    const nodeContentHeight = Math.max(
        DIMENSIONS.NODE_MINIMUM_HEIGHT,
        inputPortsHeight,
        outputPortsHeight,
        minimumLabelHeight
    )

    const nodeHeight = DIMENSIONS.NODE_INTERNAL_PADDING * 2 + nodeContentHeight

    return nodeHeight
}
