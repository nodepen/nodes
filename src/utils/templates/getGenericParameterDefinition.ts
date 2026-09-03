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

    const rawTypeName = template.name.toLowerCase()
    const typeName = rawTypeName === 'colour' ? 'color' : rawTypeName

    return {
        __order: 0,
        __direction: direction,
        name: template.name,
        nickName: template.nickName,
        description: template.description,
        typeName,
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

export const getValueListPortTemplate = (template: NodePen.NodeTemplate, direction: 'input' | 'output'): NodePen.PortTemplate => {
    if (getNodeTypeForTemplate(template) !== 'value-list') {
        throw new Error(`Cannot generate implicit port template for this thing that isn't a value list!`)
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

export const getBooleanTogglePortTemplate = (template: NodePen.NodeTemplate, direction: 'input' | 'output'): NodePen.PortTemplate => {
    if (getNodeTypeForTemplate(template) !== 'boolean-toggle') {
        throw new Error(`Cannot generate implicit port template for this thing that isn't a boolean toggle!`)
    }

    return {
        __order: 0,
        __direction: direction,
        name: template.name,
        nickName: template.nickName,
        description: template.description,
        typeName: 'boolean',
        keywords: [],
        isOptional: false
    }
}

export const getColorSwatchPortTemplate = (template: NodePen.NodeTemplate, direction: 'input' | 'output'): NodePen.PortTemplate => {
    if (getNodeTypeForTemplate(template) !== 'color-swatch') {
        throw new Error(`Cannot generate implicit port template for this thing that isn't a color swatch!`)
    }

    return {
        __order: 0,
        __direction: direction,
        name: template.name,
        nickName: template.nickName,
        description: template.description,
        typeName: 'color',
        keywords: [],
        isOptional: false
    }
}

export const getRelayPortTemplate = (template: NodePen.NodeTemplate, direction: 'input' | 'output'): NodePen.PortTemplate => {
    if (getNodeTypeForTemplate(template) !== 'relay') {
        throw new Error(`Cannot generate implicit port template for this thing that isn't a relay!`)
    }

    return {
        __order: 0,
        __direction: direction,
        name: template.name,
        nickName: template.nickName,
        description: template.description,
        typeName: 'data',
        keywords: [],
        isOptional: false
    }
}