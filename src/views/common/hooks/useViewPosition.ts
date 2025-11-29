import { useStore } from '$'

/**
 * Given the key for a certain registered view, return its current view position offset and width
 */
export const useViewPosition = (viewKey: string): [position: number, width: number] => {
  const currentViewPosition = useStore((state) => {
    const { order } = state.registry.views[viewKey] ?? {}

    if (order === undefined) {
      return [0, 0]
    }

    const [documentViewFactor, modelViewFactor] = Object.values(state.layout.viewConfiguration)

    // This is arcane and unholy and will piss me off when I revisit it in 6 months
    return [
      [0, 1 - modelViewFactor],
      [documentViewFactor, 1 - documentViewFactor]
    ][order]
  })

  return currentViewPosition as [number, number]
}
