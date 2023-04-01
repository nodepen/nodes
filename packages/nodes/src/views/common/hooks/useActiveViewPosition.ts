import { useStore } from '$'

/**
 * Returns the index of the active view, or -1 if no registered view is active.
 */
export const useActiveViewPosition = (): number => {
  const activeViewPosition = useStore((state) => {
    const registeredViewKeys = Object.keys(state.registry.views)
    const activeViewKey = state.layout.activeView

    return registeredViewKeys.findIndex((viewKey) => viewKey === activeViewKey)
  })

  return activeViewPosition
}
