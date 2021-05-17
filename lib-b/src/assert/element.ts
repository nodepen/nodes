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