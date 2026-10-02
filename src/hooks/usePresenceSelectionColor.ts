import { COLORS } from "@/constants"
import { useStore } from "@/store"

export const usePresenceSelectionColor = (nodeInstanceId: string): string | null => {
    return useStore((state) => {
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
}