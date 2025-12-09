import type { ContextMenu } from '@/views/document-view/layers/transient-element-overlay/types'
import type { NodesAppState } from '../state'

export const clearMenus = (state: NodesAppState, exclude: string[] = []): void => {
  const preservedMenus: Record<string, ContextMenu> = {}

  for (const key of exclude) {
    const menuState = state.registry.contextMenus[key]
    if (menuState) {
      preservedMenus[key] = state.registry.contextMenus[key]
    }
  }

  state.registry.contextMenus = { ...preservedMenus }
}