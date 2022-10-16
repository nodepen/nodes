import { useStore } from '$'

/**
 * Given a named tag (or 'static' for non-moving content), return how far away that tab is from
 * the currently active view.
 * @returns An integer value where `0` indicates it is the active tab.
 */
export const useActiveViewTransform = (tab: 'static' | 'graph' | 'model'): number => {
    const activeTabConfiguration = useStore((store) => store.layout.tabs.configuration[store.layout.tabs.current])

  const layerTabConfiguration = useStore((store) => {
    switch (tab) {
      case 'static': {
        return { order: activeTabConfiguration?.order ?? 0 }
      }
      default: {
        return store.layout.tabs.configuration[tab]
      }
    }
  })

  const activeTabDelta = layerTabConfiguration.order - activeTabConfiguration.order

  return activeTabDelta
}