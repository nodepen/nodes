import { COMPONENTS } from '@/constants'
import type * as NodePen from '@/types'

export type NodePenNodeType =
    | 'generic-node'
    | 'generic-parameter'
    | 'number-slider'
    | 'panel'
    | 'value-list'
    | 'boolean-toggle'
    | 'color-swatch'
    | 'color-gradient'
    | 'relay'
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
                case COMPONENTS.BOOLEAN_TOGGLE: {
                    return 'boolean-toggle'
                }
                case COMPONENTS.COLOR_SWATCH: {
                    return 'color-swatch'
                }
                case COMPONENTS.GRADIENT: {
                    return 'color-gradient'
                }
                case COMPONENTS.RELAY: {
                    return 'relay'
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