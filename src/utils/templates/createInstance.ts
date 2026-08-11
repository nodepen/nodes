import type * as NodePen from '@/types'
import { newGuid } from '../common'
import { getNodeDimensions } from '../node-dimensions'
import { getNodeTypeForTemplate } from './getNodeTypeForTemplate'
import { DIMENSIONS } from '@/constants'
import { createSingleValue } from '../data-trees/createSingleValue'
import { createEmptyTree } from '../data-trees/createEmptyTree'

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
            node.inputs['input'] = 0
            node.portConfigurations = {
                input: {
                    label: null,
                    flags: []
                },
                output: {
                    label: null,
                    flags: []
                }
            }
            node.dimensions = {
                width: 2 * DIMENSIONS.NODE_PORT_MINIMUM_WIDTH + DIMENSIONS.NODE_LABEL_WIDTH + 4 * DIMENSIONS.NODE_INTERNAL_PADDING,
                height: DIMENSIONS.NODE_LABEL_WIDTH
            }
            node.anchors = {
                'labelDeltaX': {
                    dx: 21,
                    dy: 0
                },
                'output': {
                    dx: node.dimensions.width,
                    dy: node.dimensions.height / 2
                },
                'input': {
                    dx: 0,
                    dy: node.dimensions.height / 2
                }
            }
            node.sources = {
                'input': []
            }

            // Trying to stay positive
            if (template.name.toLowerCase() === 'boolean') {
                node.values['input'] = createSingleValue('true', 'boolean')
            } else {
                node.values['input'] = {
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
            node.inputs['input'] = 0
            node.outputs['output'] = 0
            node.portConfigurations = {
                input: {
                    label: null,
                    flags: []
                },
                output: {
                    label: null,
                    flags: []
                }
            }
            node.dimensions = {
                width: DIMENSIONS.NUMBER_SLIDER_VALUE_WIDTH + DIMENSIONS.NUMBER_SLIDER_SLIDER_WIDTH + 5 * DIMENSIONS.NODE_INTERNAL_PADDING,
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
                },
                'handle': {
                    dx: 0,
                    dy: 0
                }
            }
            node.values['input'] = createSingleValue('5', 'number')
            node.nodeConfiguration = {
                min: 0,
                max: 10,
                precision: 2
            } as NodePen.NumberSliderConfig

            break
        }
        case 'panel': {
            node.inputs['input'] = 0
            node.outputs['output'] = 0
            node.portConfigurations = {
                input: {
                    label: null,
                    flags: []
                },
                output: {
                    label: null,
                    flags: []
                }
            }
            node.dimensions = {
                width: DIMENSIONS.PANEL_DEFAULT_WIDTH,
                height: DIMENSIONS.PANEL_DEFAULT_HEIGHT
            }
            node.anchors = {
                'labelDeltaX': {
                    dx: 0,
                    dy: 0
                },
                'input': {
                    dx: 0,
                    dy: DIMENSIONS.PANEL_DEFAULT_HEIGHT / 2
                },
                'output': {
                    dx: DIMENSIONS.PANEL_DEFAULT_WIDTH,
                    dy: DIMENSIONS.PANEL_DEFAULT_HEIGHT / 2
                }
            }
            node.nodeConfiguration = {
                textContent: null,
                multilineData: false
            } as NodePen.PanelConfig
            node.sources['input'] = []
            node.values['input'] = createSingleValue('', 'string')

            break
        }
        case 'value-list': {
            node.inputs['input'] = 0
            node.outputs['output'] = 0
            node.portConfigurations = {
                input: {
                    label: null,
                    flags: []
                },
                output: {
                    label: null,
                    flags: []
                }
            }
            node.dimensions = {
                width: DIMENSIONS.VALUE_LIST_WIDTH,
                height: DIMENSIONS.VALUE_LIST_HEIGHT
            },
                node.anchors = {
                    'labelDeltaX': {
                        dx: 0,
                        dy: 0
                    },
                    'output': {
                        dx: node.dimensions.width,
                        dy: node.dimensions.height / 2
                    },
                },
                node.nodeConfiguration = {
                    listMode: 'dropdown',
                    items: [
                        {
                            name: 'Ladybug',
                            expression: "\"Ladybug\"",
                            isSelected: true,
                        },
                        {
                            name: 'Pufferfish',
                            expression: "\"Pufferfish\"",
                            isSelected: false
                        },
                        {
                            name: 'Weaverbird',
                            expression: "\"Weaverbird\"",
                            isSelected: false
                        }
                    ]
                } as NodePen.ValueListConfig
            node.sources['input'] = []
            node.values['input'] = createEmptyTree()

            break
        }
        case 'boolean-toggle': {
            node.inputs['input'] = 0
            node.outputs['output'] = 0
            node.portConfigurations = {
                input: {
                    label: 'Toggle',
                    flags: []
                },
                output: {
                    label: null,
                    flags: []
                }
            }
            node.dimensions = {
                width: DIMENSIONS.BOOLEAN_TOGGLE_WIDTH,
                height: DIMENSIONS.BOOLEAN_TOGGLE_HEIGHT
            }
            node.anchors = {
                'labelDeltaX': {
                    dx: 0,
                    dy: 0
                },
                'output': {
                    dx: node.dimensions.width,
                    dy: node.dimensions.height / 2
                },
            }
            node.nodeConfiguration = {
                value: false
            } as NodePen.BooleanToggleConfig
            node.sources['input'] = []
            node.values['input'] = createEmptyTree()

            break
        }
    }

    return node
}
