import { useStore } from '$'
import { COLORS } from '@/constants'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'

export const useSelectionColor = (nodeInstanceId: string): string => {
    const nodeType = getNodeTypeForTemplate(useStore.getState().templates[useStore.getState().document.nodes[nodeInstanceId]?.templateId])

    const presenceColor = useStore((state) => {
        let color: string | null = null

        for (const [sessionId, nodeInstanceIds] of Object.entries(state.presence?.selection ?? {})) {
            if (sessionId === state.presence?.sessionId) {
                break
            }

            if (nodeInstanceIds.includes(nodeInstanceId)) {
                color = state.presence?.sessions?.[sessionId]?.color ?? null
                break
            }
        }

        return color
    })


    const isSelected = useStore((state) => state.registry.selection.nodes.includes(nodeInstanceId))
    const isHidden = useStore((state) => {
        switch (nodeType) {
            case 'generic-node': {
                return !state.document.nodes[nodeInstanceId].status.isVisible
            }
            case 'generic-parameter':
            case 'number-slider':
            case 'panel':
            default: {
                return false
            }
        }
    })

    const sessionColor = (isSelected && isHidden)
        ? COLORS.SWAMPGREEN
        : isSelected
            ? COLORS.GREEN
            : null

    const hiddenColor = isHidden ? COLORS.GREY : null

    return sessionColor ?? presenceColor ?? hiddenColor ?? COLORS.LIGHT
}