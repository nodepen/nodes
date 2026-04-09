import type * as NodePen from '@/types'
import { newGuid } from '../common'
import { getNodeDimensions } from '../node-dimensions'
import { getNodeTypeForTemplate } from './getNodeTypeForTemplate'
import { DIMENSIONS } from '@/constants'
import { createSingleValue } from '../data-trees/createSingleValue'

export const createInstance = (template: NodePen.NodeTemplate): NodePen.DocumentNode => {
    const { guid, category, inputs: templateInputs, outputs: templateOutputs } = template

    const node: NodePen.DocumentNode = {
        instanceId: newGuid(),
        templateId: guid,
        position: {
            x: 0,
            y: 0,
        },
        dimensions: {
            width: 0,
            height: 0,
        },
        status: {
            isVisible: true,
            isEnabled: true,
            isProvisional: false,
        },
        anchors: {
            labelDeltaX: {
                dx: 0,
                dy: 0,
            },
        },
        values: {},
        sources: {},
        inputs: {},
        outputs: {},
        portConfigurations: {},
    }

    switch (getNodeTypeForTemplate(template)) {
        case 'generic-node': {
            for (const input of templateInputs) {
                const { __order: order } = input

                const inputInstanceId = newGuid()

                node.sources[inputInstanceId] = []
                node.inputs[inputInstanceId] = order
                node.values[inputInstanceId] = {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                }
                node.portConfigurations[inputInstanceId] = {
                    label: null,
                    flags: [],
                }
            }

            for (const output of templateOutputs) {
                const { __order: order } = output

                const outputInstanceId = newGuid()

                node.outputs[outputInstanceId] = order
                node.portConfigurations[outputInstanceId] = {
                    label: null,
                    flags: [],
                }
            }

            const { dimensions, anchors } = getNodeDimensions(node, template)

            node.dimensions = dimensions
            node.anchors = anchors

            break
        }
        case 'generic-parameter': {
            node.outputs['output'] = 0
            node.portConfigurations['output'] = {
                label: null,
                flags: []
            }
            node.dimensions = {
                width: 2 * DIMENSIONS.NODE_PORT_MINIMUM_WIDTH + DIMENSIONS.NODE_LABEL_WIDTH + 4 * DIMENSIONS.NODE_INTERNAL_PADDING,
                height: DIMENSIONS.NODE_LABEL_WIDTH
            }
            node.anchors = {
                'labelDeltaX': {
                    dx: 0,
                    dy: 0
                },
                'output': {
                    dx: node.dimensions.width,
                    dy: node.dimensions.height / 2
                }
            }

            // Trying to stay positive
            if (template.name.toLowerCase() === 'boolean') {
                node.values['output'] = createSingleValue('true', 'boolean')
            } else {
                node.values['output'] = {
                    branches: [],
                    stats: {
                        branchCount: 0,
                        branchValueCountDomain: [0, 0],
                        treeStructure: 'empty',
                        valueCount: 0,
                        valueTypes: [],
                    },
                }
            }

            break
        }
        case 'number-slider': {
            node.outputs['output'] = 0
            node.portConfigurations['output'] = {
                label: null,
                flags: []
            }
            node.dimensions = {
                width: DIMENSIONS.NUMBER_SLIDER_WIDTH,
                height: DIMENSIONS.NUMBER_SLIDER_HEIGHT
            }
            node.anchors = {
                'labelDeltaX': {
                    dx: 0,
                    dy: 0
                },
                'output': {
                    dx: node.dimensions.width,
                    dy: node.dimensions.height / 2
                }
            }
            node.values['output'] = createSingleValue('5', 'number')

            break
        }
    }

    return node
}
