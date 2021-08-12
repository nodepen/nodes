import { GraphElement, GripElement, VisibleElement } from '../nodepen/element/data/common'
import { Element } from '../nodepen'
import { ElementTemplateType } from '../nodepen/element/templates'

export const isStaticComponent = (element: Element<ElementTemplateType>): element is Element<'static-component'> => {
    return element.template.type === 'static-component'
}

export const isStaticParameter = (element: Element<ElementTemplateType>): element is Element<'static-parameter'> => {
    return element.template.type === 'static-parameter'
}

export const isPanel = (element: Element<ElementTemplateType>): element is Element<'panel'> => {
    return element.template.type === 'panel'
}

export const isNumberSlider = (element: Element<ElementTemplateType>): element is Element<'number-slider'> => {
    return element.template.type === 'number-slider'
}

export const isWire = (element: Element<ElementTemplateType>): element is Element<'wire'> => {
    return element.template.type === 'wire'
}

export const isRegion = (element: Element<ElementTemplateType>): element is Element<'region'> => {
    return element.template.type === 'region'
}

export const isVisibleElement = (data: GraphElement | GripElement | VisibleElement): data is VisibleElement => {
    return 'position' in data && 'dimensions' in data
}

export const isGraphElement = (data: GraphElement | GripElement | VisibleElement): data is GraphElement => {
    return 'sources' in data
}

export const isGripElement = (data: GraphElement | GripElement | VisibleElement): data is GripElement => {
    return 'anchors' in data
}