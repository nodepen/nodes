import { useStore } from '$'

/**
 * Given the key for a certain registered view, return its integer "position" relative to the active view.
 * @returns Integer based position or `null` if `viewKey` is not registered.
 */
export const useViewPosition = (viewKey: string): number | null => {
    const currentViewPosition = useStore((state) => {
        const registeredViewConfigurations = state.registry.views
        const activeView = state.layout.activeView

        if (!activeView) {
            return null
        }

        const activeViewConfiguration = registeredViewConfigurations[activeView]
        const currentViewConfiguration = registeredViewConfigurations[viewKey]

        if (!activeViewConfiguration) {
            console.log(`🐍 View configuration not found for active view [${activeView}]`)
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