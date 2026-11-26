import { DIMENSIONS } from '@/constants'
import type * as NodePen from '@/types'
import { getNodeDimensions } from './getNodeDimensions'
import { getLabelWidth } from './getLabelWidth'
import { getFallbackPortTemplate } from '../templates/getGenericParameterDefinition'

const {
    NODE_INTERNAL_PADDING,
    NODE_PORT_MINIMUM_WIDTH,
    GRADIENT_WIDTH,
    GRADIENT_CONTROL_AREA_HEIGHT,
} = DIMENSIONS

export const getGradientDimensions = (
    node: NodePen.DocumentNode,
    template: NodePen.NodeTemplate
): Pick<NodePen.DocumentNode, 'anchors' | 'dimensions'> => {
    const { dimensions, anchors } = getNodeDimensions(node, template)

    const width = GRADIENT_WIDTH

    anchors.labelDeltaX = { dx: width / 2, dy: 0 }

    for (const portInstanceId of Object.keys(node.outputs)) {
        anchors[portInstanceId] = {
            ...anchors[portInstanceId],
            dx: width,
        }
    }

    return {
        dimensions: { width, height: dimensions.height },
        anchors,
    }
}

export const getGradientInputColumnWidth = (
    node: NodePen.DocumentNode,
    template: NodePen.NodeTemplate
): number => {
    const labelWidths = Object.entries(node.inputs).map(([portInstanceId, order]) => {
        const portTemplate = template.inputs[order] ?? getFallbackPortTemplate(template, 'input', order)
        const portConfiguration = node.portConfigurations[portInstanceId] ?? { label: null, flags: [] }

        return getLabelWidth(portTemplate, portConfiguration)
    })

    return Math.max(...labelWidths, NODE_PORT_MINIMUM_WIDTH)
}

export const getGradientControlAreaExtents = (
    node: NodePen.DocumentNode,
    template: NodePen.NodeTemplate,
    nodePosition: NodePen.DocumentNode['position']
): { x: number, y: number, width: number, height: number } => {
    const dx = NODE_INTERNAL_PADDING + getGradientInputColumnWidth(node, template) + NODE_INTERNAL_PADDING

    const height = GRADIENT_CONTROL_AREA_HEIGHT

    return {
        x: nodePosition.x + dx,
        y: nodePosition.y + (node.dimensions.height - height) / 2,
        width: node.dimensions.width - dx - NODE_INTERNAL_PADDING * 6,
        height,
    }
}
