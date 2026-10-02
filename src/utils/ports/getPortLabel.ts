import type * as NodePen from '@/types'
import { getNodeTypeForTemplate } from '../templates/getNodeTypeForTemplate'
import { getPortTemplate, type PortReference } from './getPortTemplate'

export type PortLabel = {
    currentLabel: string
    defaultLabel: string
    currentDescription: string
    defaultDescription: string
}

export const getPortLabel = (document: NodePen.Document, templates: NodePen.NodeTemplate[], ref: PortReference): PortLabel => {
    const { nodeInstanceId, portInstanceId } = ref

    const node = document.nodes[nodeInstanceId]

    if (!node) {
        return {
            defaultLabel: '',
            currentLabel: '',
            defaultDescription: '',
            currentDescription: ''
        }
    }

    const customLabel = node.portConfigurations[portInstanceId]?.label
    const customDescription = node.portConfigurations[portInstanceId]?.description

    const template = templates.find((template) => template.guid === node.templateId)

    // i.e. clusters
    if (!template) {
        return {
            defaultLabel: '',
            currentLabel: customLabel ?? '',
            defaultDescription: '',
            currentDescription: customDescription ?? ''
        }
    }

    const nodeType = getNodeTypeForTemplate(template)
    const portTemplate = getPortTemplate(document, templates, ref)

    const defaultLabel = nodeType === 'generic-parameter' ? template.name : portTemplate.name
    const defaultDescription = portTemplate.description

    return {
        defaultLabel,
        currentLabel: customLabel ?? defaultLabel,
        defaultDescription,
        currentDescription: customDescription ?? defaultDescription
    }
}
