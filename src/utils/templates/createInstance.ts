import type * as NodePen from '@nodepen/core'
import { newGuid } from '../common'
import { getNodeDimensions } from '../node-dimensions'

export const createInstance = (template: NodePen.NodeTemplate): NodePen.DocumentNode => {
  const { guid, inputs: templateInputs, outputs: templateOutputs } = template

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

  return node
}
