import type * as NodePen from '@/types'
import { DIMENSIONS } from '@/constants'
import { getNodeTypeForTemplate } from '../templates/getNodeTypeForTemplate'

export const getNodeHeight = (
    node: NodePen.DocumentNode,
    template: NodePen.NodeTemplate,
    useIcon = false
): number => {
    const { inputs, outputs } = node
    const { nickName } = template

    const nodeType = getNodeTypeForTemplate(template)

    const minimumNodeHeight = nodeType === 'cluster' ? DIMENSIONS.CLUSTER_PREVIEW_HEIGHT + 2 * DIMENSIONS.NODE_INTERNAL_PADDING : DIMENSIONS.NODE_MINIMUM_HEIGHT

    const inputPortsHeight = Object.keys(inputs).length * DIMENSIONS.NODE_PORT_HEIGHT
    const outputPortsHeight = Object.keys(outputs).length * DIMENSIONS.NODE_PORT_HEIGHT

    const minimumLabelHeight = useIcon || nodeType === 'cluster' ? 24 : nickName.length * 15 // not monospace, estimate

    const nodeContentHeight = Math.max(
        minimumNodeHeight,
        inputPortsHeight,
        outputPortsHeight,
        minimumLabelHeight
    )

    const nodeHeight = DIMENSIONS.NODE_INTERNAL_PADDING * 2 + nodeContentHeight

    return nodeHeight
}
