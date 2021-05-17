import { Element } from '../element'
import { ElementTemplateType } from '../element/templates'

export type GrasshopperGraph = {
    [id: string]: Element<ElementTemplateType>
}