import { COMPONENTS } from '@/constants'
import type * as NodePen from '@/types'
import { getScriptNodeLanguage } from './getScriptNodeLanguage'

export type NodePenNodeType =
    | 'generic-node'
    | 'generic-parameter'
    | 'cluster'
    | 'number-slider'
    | 'md-slider'
    | 'graph-mapper'
    | 'panel'
    | 'value-list'
    | 'boolean-toggle'
    | 'color-swatch'
    | 'color-gradient'
    | 'relay'
    | 'expression'
    | 'script'
    | 'unknown'

export const getNodeTypeForTemplate = (template?: NodePen.NodeTemplate): NodePenNodeType => {
    if (!template) {
        return 'unknown'
    }

    if (template.guid === 'cluster') {
        return 'cluster'
    }

    if (template.guid === COMPONENTS.EXPRESSION) {
        return 'expression'
    }

    if (getScriptNodeLanguage(template.guid)) {
        return 'script'
    }

    switch (template.category.toLowerCase()) {
        case 'params': {
            switch (template.guid) {
                case COMPONENTS.NUMBER_SLIDER: {
                    return 'number-slider'
                }
                case COMPONENTS.MD_SLIDER: {
                    return 'md-slider'
                }
                case COMPONENTS.GRAPH_MAPPER: {
                    return 'graph-mapper'
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
                    if (template.inputs.length > 0 || template.outputs.length > 0) {
                        // Some params (Read File) have inputs and outputs
                        return 'generic-node'
                    }

                    return 'generic-parameter'
                }
            }
        }
        default: {
            return 'generic-node'
        }
    }
}
