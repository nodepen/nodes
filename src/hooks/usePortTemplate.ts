import type * as NodePen from '@/types'
import { useStore } from '$'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'
import { getBooleanTogglePortTemplate, getGenericParameterPortTemplate, getNumberSliderPortTemplate, getPanelPortTemplate } from '@/utils/templates/getGenericParameterDefinition'
import { useNodePortTemplate } from './useNodePortTemplate'

/**
 * Given a port reference, return its `PortTemplate`.
 * @remarks Params, sliders, panels, and boolean toggles don't emit real port templates for their own value port
 * (`template.inputs`/`template.outputs` are empty for those templates), so this falls back to a
 * synthesized template for those node types when {@link useNodePortTemplate} comes up empty.
 */
export const usePortTemplate = (nodeInstanceId: string, portInstanceId: string): NodePen.PortTemplate | null => {
    const explicitTemplate = useNodePortTemplate(nodeInstanceId, portInstanceId)

    const implicitTemplate = useStore((state) => {
        if (explicitTemplate) {
            return null
        }

        const node = state.document.nodes[nodeInstanceId]
        const template = node ? state.templates[node.templateId] : undefined

        if (!node || !template) {
            return null
        }

        const direction = portInstanceId === 'input' ? 'input' : 'output'

        switch (getNodeTypeForTemplate(template)) {
            case 'generic-parameter': {
                return getGenericParameterPortTemplate(template, direction)
            }
            case 'number-slider': {
                return getNumberSliderPortTemplate(template)
            }
            case 'panel': {
                return getPanelPortTemplate(template, direction)
            }
            case 'boolean-toggle': {
                return getBooleanTogglePortTemplate(template, direction)
            }
            default: {
                return null
            }
        }
    })

    return explicitTemplate ?? implicitTemplate
}
