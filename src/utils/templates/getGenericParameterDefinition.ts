import type * as NodePen from '@/types'
import { getNodeTypeForTemplate } from './getNodeTypeForTemplate'

/**
 * Given a `generic-port` type template, generate a valid `PortTemplate`
 * Floating params are special in that they _are_ a param, and so grasshopper
 * does not emit input/output port templates like it does for other components.
 * */
export const getGenericParameterPortTemplate = (template: NodePen.NodeTemplate, direction: 'input' | 'output'): NodePen.PortTemplate => {
    if (getNodeTypeForTemplate(template) !== 'generic-parameter') {
        throw new Error(`Cannot generate implicit port template from non-parameter node`)
    }

    return {
        __order: 0,
        __direction: direction,
        name: template.name,
        nickName: template.nickName,
        description: template.description,
        typeName: template.name.toLowerCase(),
        keywords: [],
        isOptional: false
    }
}

export const getNumberSliderPortTemplate = (template: NodePen.NodeTemplate): NodePen.PortTemplate => {
    if (getNodeTypeForTemplate(template) !== 'number-slider') {
        throw new Error(`Cannot generate implicit port template for this thing that isn't a number slider!`)
    }

    return {
        __order: 0,
        __direction: 'output',
        name: template.name,
        nickName: template.nickName,
        description: template.description,
        typeName: template.name.toLowerCase(),
        keywords: [],
        isOptional: false
    }
}

export const getPanelPortTemplate = (template: NodePen.NodeTemplate, direction: 'input' | 'output'): NodePen.PortTemplate => {
    if (getNodeTypeForTemplate(template) !== 'panel') {
        throw new Error('Cannot generate port template for non-panel thing here!')
    }

    return {
        __order: 0,
        __direction: direction,
        name: template.name,
        nickName: template.nickName,
        description: template.description,
        typeName: 'string',
        keywords: [],
        isOptional: false
    }
}