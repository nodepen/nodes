import { GraphElement, VisibleElement } from './types'
import { ElementTemplateType } from '../templates'

export type ElementDataEntry = {
    [type in ElementTemplateType]: GraphElement | VisibleElement
}