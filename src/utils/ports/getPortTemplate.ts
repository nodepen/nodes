import type * as NodePen from '@/types'
import { getNodeTypeForTemplate } from '../templates/getNodeTypeForTemplate'
import { getBooleanTogglePortTemplate, getColorSwatchPortTemplate, getFallbackPortTemplate, getGenericParameterPortTemplate, getNumberSliderPortTemplate, getPanelPortTemplate, getRelayPortTemplate, getValueListPortTemplate } from '../templates/getGenericParameterDefinition'
import { getPortTemplateFromConfiguration } from './getPortTemplateFromConfiguration'

export type PortReference = {
    nodeInstanceId: string
    portInstanceId: string
    direction: 'input' | 'output'
}

export const getPortTemplate = (document: NodePen.Document, templates: NodePen.NodeTemplate[], ref: PortReference): NodePen.PortTemplate => {
    const { nodeInstanceId, portInstanceId, direction } = ref

    const node = document.nodes[nodeInstanceId]
    const nodeTemplate = templates.find((template) => template.guid === node.templateId)
    const nodeType = getNodeTypeForTemplate(nodeTemplate)

    if (!nodeTemplate) {
        // i.e. clusters
        return getPortTemplateFromConfiguration(node, portInstanceId, direction) ?? getFallbackPortTemplate(nodeTemplate!, direction, 0)
    }

    switch (nodeType) {
        case 'generic-node':
        case 'color-gradient': {
            const order = document.nodes[nodeInstanceId][`${direction}s`][portInstanceId]
            return nodeTemplate[`${direction}s`][order] ?? getFallbackPortTemplate(nodeTemplate, direction, order)
        }
        case 'generic-parameter': {
            return getGenericParameterPortTemplate(nodeTemplate, direction)
        }
        case 'number-slider': {
            return getNumberSliderPortTemplate(nodeTemplate)
        }
        case 'panel': {
            return getPanelPortTemplate(nodeTemplate, direction)
        }
        case 'value-list': {
            return getValueListPortTemplate(nodeTemplate, direction)
        }
        case 'boolean-toggle': {
            return getBooleanTogglePortTemplate(nodeTemplate, direction)
        }
        case 'color-swatch': {
            return getColorSwatchPortTemplate(nodeTemplate, direction)
        }
        case 'relay': {
            return getRelayPortTemplate(nodeTemplate, direction)
        }
        case 'unknown': {
            return getFallbackPortTemplate(nodeTemplate, direction, 0)
        }
    }
}