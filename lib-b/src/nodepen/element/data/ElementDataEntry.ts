import { GraphElement, VisibleElement } from './common'
import { ElementTemplateType } from '../templates'

export type ElementDataEntry = {
    [type in ElementTemplateType]: GraphElement | VisibleElement
}