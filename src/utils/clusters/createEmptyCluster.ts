import type * as NodePen from '@/types'
import { getNodeDimensions } from '../node-dimensions'
import { createInstance } from '../templates'
import { CLUSTER_TEMPLATE } from './clusterTemplate'

// New cluster with null ref
export const createEmptyCluster = (): { cluster: NodePen.DocumentCluster; node: NodePen.DocumentNode } => {
    const clusterTemplate: NodePen.NodeTemplate = {
        ...CLUSTER_TEMPLATE,
        inputs: [],
        outputs: []
    }

    const clusterNode = createInstance(clusterTemplate)

    const { anchors, dimensions } = getNodeDimensions(clusterNode, clusterTemplate)

    const node: NodePen.DocumentNode = {
        ...clusterNode,
        anchors: {
            ...clusterNode.anchors,
            ...anchors
        },
        dimensions
    }

    return {
        cluster: {
            ref: null,
            meta: null,
            nodeInstanceId: node.instanceId
        },
        node
    }
}
