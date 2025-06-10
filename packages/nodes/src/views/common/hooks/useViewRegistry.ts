import { useEffect } from 'react'
import { useStore, useDispatch } from '$'
import { useViewPosition } from './useViewPosition'

type ViewConfig = {
  key: string
  label: string
}

type ViewState = {
  viewPosition: number | null
}

/**
 * Given information about a view in the current app, register it in global
 * state and emit information about its relationship to other views.
 */
export const useViewRegistry = (config: ViewConfig): [position: number, width: number] => {
  const { key, label } = config

  const { apply } = useDispatch()

  useEffect(() => {
    // Get current view information
    const currentViews = useStore.getState().registry.views

    if (key in currentViews) {
      return
    }

    const nextViewIndex = Object.entries(currentViews).length

    console.log(`⚙️⚙️⚙️ Registered view [${key}] at position [${nextViewIndex}]`)

    // Add view to registry
    apply((state) => {
      state.registry.views[key] = {
        label,
        order: nextViewIndex,
      }
      state.layout.viewConfiguration[nextViewIndex] = nextViewIndex === 0 ? 1 : 0
    })
  })

  const viewPosition = useViewPosition(key)

  return viewPosition
}
