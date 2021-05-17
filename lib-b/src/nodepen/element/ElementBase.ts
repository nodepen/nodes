import { ElementTemplate, ElementTemplateType } from './templates'
import { ElementData } from './data'

export type ElementBase<T extends ElementTemplateType> = {
    id: string,
    template: ElementTemplate[T]
    current: ElementData[T]
}
