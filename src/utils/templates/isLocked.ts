import { useStore } from '$'

export const isLocked = (templateId: string): boolean => {
    return useStore.getState().templates[templateId]?.isLocked ?? false
}
