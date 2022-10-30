import { useRef, useEffect } from 'react'
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
export const useViewRegistry = (config: ViewConfig): ViewState => {
    const { key, label } = config

    const { apply } = useDispatch()

    const isRegistered = useRef(false)

    useEffect(() => {
        if (isRegistered.current) {
            return
        }

        isRegistered.current = true

        // Get current view information
        const currentViews = useStore.getState().registry.views
        const nextViewIndex = Object.entries(currentViews).length

        console.log(`${key} registered at ${nextViewIndex}`)

        // Add view to registry
        apply((state) => {
            state.registry.views[key] = {
                label,
                order: nextViewIndex
            }
        })
    })

    const viewPosition = useViewPosition(key)

    return { viewPosition }
}