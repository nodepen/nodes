import type * as NodePen from '@/types'
import { getNodeDimensions } from '../node-dimensions'
import { createInstance } from '../templates'
import { getNodeTypeForTemplate } from '../templates/getNodeTypeForTemplate'
import { getPortTemplate } from '../ports/getPortTemplate'
import { getPortLabel } from '../ports/getPortLabel'
import { newGuid } from '../common'
import { CLUSTER_TEMPLATE } from './clusterTemplate'

type ClusterPortMeta = Pick<NodePen.PortConfiguration, 'label' | 'description' | 'typeName'>

// Given a document with input & output controls, build the node and cluster ref
// Note: callers are expected to fill in:
// - `cluster.ref`
// - `cluster.meta`
// - `node.position`
export const createCluster = (
    document: NodePen.Document,
    templates: NodePen.NodeTemplate[]
): { cluster: NodePen.DocumentCluster; node: NodePen.DocumentNode } => {
    const getClusterPorts = (
        direction: 'input' | 'output'
    ): { portTemplates: NodePen.PortTemplate[]; metaByControlId: Record<string, ClusterPortMeta> } => {
        const portTemplates: NodePen.PortTemplate[] = []
        const metaByControlId: Record<string, ClusterPortMeta> = {}

        for (const [controlId, control] of Object.entries(document.controls[direction])) {
            const portRef = {
                nodeInstanceId: control.ref.nodeInstanceId,
                portInstanceId: control.ref.portInstanceId,
                direction
            }

            const node = document.nodes[control.ref.nodeInstanceId]
            const nodeTemplate = templates.find((template) => template.guid === node?.templateId)
            const isGenericParameter = getNodeTypeForTemplate(nodeTemplate) === 'generic-parameter'

            // 'generic-param' nodes always store the visible label on 'input'
            const labelRef = isGenericParameter ? { ...portRef, portInstanceId: 'input' } : portRef

            const portTemplate = getPortTemplate(document, templates, portRef)
            const portLabel = getPortLabel(document, templates, labelRef)

            const label = portLabel.currentLabel
            const description = control.description ?? portTemplate.description
            const typeName = portTemplate.typeName

            portTemplates.push({
                __order: control.order,
                __direction: direction,
                name: label,
                nickName: label,
                description,
                typeName,
                keywords: [],
                isOptional: false
            })

            metaByControlId[controlId] = { label, description, typeName }
        }

        return { portTemplates, metaByControlId }
    }

    const inputPorts = getClusterPorts('input')
    const outputPorts = getClusterPorts('output')

    const clusterTemplate: NodePen.NodeTemplate = {
        ...CLUSTER_TEMPLATE,
        inputs: inputPorts.portTemplates,
        outputs: outputPorts.portTemplates
    }

    const clusterNode = createInstance(clusterTemplate)

    const remapClusterPortIds = (direction: 'input' | 'output', metaByControlId: Record<string, ClusterPortMeta>) => {
        const controls = document.controls[direction]
        const generatedPorts = clusterNode[`${direction}s`]

        const generatedIdByOrder = Object.fromEntries(
            Object.entries(generatedPorts).map(([generatedId, order]) => [order, generatedId])
        )

        const remappedPorts: Record<string, number> = {}

        for (const [controlId, control] of Object.entries(controls)) {
            const generatedId = generatedIdByOrder[control.order]

            remappedPorts[controlId] = control.order

            clusterNode.portConfigurations[controlId] = {
                ...metaByControlId[controlId],
                flags: []
            }
            delete clusterNode.portConfigurations[generatedId]

            if (direction === 'input') {
                clusterNode.sources[controlId] = clusterNode.sources[generatedId]
                clusterNode.values[controlId] = clusterNode.values[generatedId]
                delete clusterNode.sources[generatedId]
                delete clusterNode.values[generatedId]
            }
        }

        if (direction === 'input') {
            clusterNode.inputs = remappedPorts
        } else {
            clusterNode.outputs = remappedPorts
        }
    }

    remapClusterPortIds('input', inputPorts.metaByControlId)
    remapClusterPortIds('output', outputPorts.metaByControlId)

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
            instanceId: newGuid(),
            ref: null,
            meta: null,
            nodeInstanceId: node.instanceId
        },
        node
    }
}
