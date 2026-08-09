import { COMPONENTS } from '@/constants'
import type * as NodePen from '@/types'

type NodePenNodeType =
    | 'generic-node'
    | 'generic-parameter'
    | 'number-slider'
    | 'panel'
    | 'value-list'
    | 'unknown'

export const getNodeTypeForTemplate = (template?: NodePen.NodeTemplate): NodePenNodeType => {
    if (!template) {
        return 'unknown'
    }

    switch (template.category.toLowerCase()) {
        case 'params': {
            switch (template.guid) {
                case COMPONENTS.NUMBER_SLIDER: {
                    return 'number-slider'
                }
                case COMPONENTS.PANEL: {
                    return 'panel'
                }
                case COMPONENTS.VALUE_LIST: {
                    return 'value-list'
                }
                default: {
                    return 'generic-parameter'
                }
            }
        }
        default: {
            return 'generic-node'
        }
    }
}