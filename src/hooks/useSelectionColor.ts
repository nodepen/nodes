import { useStore } from '$'
import { COLORS } from '@/constants'
import { getNodeTypeForTemplate } from '@/utils/templates/getNodeTypeForTemplate'

type SelectionColorData = {
    sessionColor: string
    presenceColor: string | null
}

export const useSelectionColor = (nodeInstanceId: string): SelectionColorData => {
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
        const node = state.document.nodes[nodeInstanceId]

        if (!node) {
            return false
        }

        switch (nodeType) {
            case 'generic-node':
            case 'relay': {
                return !node.status.isVisible
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

    return {
        sessionColor: sessionColor ?? hiddenColor ?? COLORS.LIGHT,
        presenceColor
    }

    // return sessionColor ?? presenceColor ?? hiddenColor ?? COLORS.LIGHT
}