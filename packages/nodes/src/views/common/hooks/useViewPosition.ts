import { useStore } from '$'

/**
 * Given the key for a certain registered view, return its integer "position" relative to the active view.
 * @returns Integer based position or `null` if `viewKey` is not registered.
 */
export const useViewPosition = (viewKey: string): number | null => {
    const currentViewPosition = useStore((state) => {
        const registeredViewConfigurations = Object.entries(state.registry.views)
        const activeView = state.layout.activeView

        const activeViewConfiguration = registeredViewConfigurations.find(([_key, config]) => config.order === activeView)?.[1]
        const currentViewConfiguration = registeredViewConfigurations.find(([key, _config]) => key === viewKey)?.[1]

        if (!activeViewConfiguration) {
            console.log(`🐍 View configuration not found for active view position ${activeView}`)
            return null
        }

        if (!currentViewConfiguration) {
            console.log(`🐍 View configuration not found for target view [${viewKey}]`)
            return null
        }

        return currentViewConfiguration.order - activeViewConfiguration.order
    })

    return currentViewPosition
}