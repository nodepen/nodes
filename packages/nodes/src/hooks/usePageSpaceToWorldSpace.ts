import { useCallback } from 'react'
import { useStore, useStoreRef } from '$'

// TODO:
// I think, technically, this creates a stable but *new* callback for every component that uses the hook.
// It could be fun to see what this would look like if it had to guarantee *one* function reference.
// (...and if it's even worth the trouble to do so)

/**
 * Get a stable reference to a function that can map a position in browser page space to its position in world space.
 * @remarks Guarantees latest values for camera and canvas div geometry without causing re-renders.
 */
export const usePageSpaceToWorldSpace = (): (pageX: number, pageY: number) => [x: number, y: number] => {
    const camera = useStoreRef((state) => state.camera)

    const canvas = useStore((state) => state.registry.canvasRoot)

    const callback = useCallback((pageX: number, pageY: number): [x: number, y: number] => {
        const { zoom, position } = camera.current

        const { width, height, left, top } = (canvas.current ?? document.documentElement).getBoundingClientRect()

        // Current camera position in page space (aka canvas div center)
        const absoluteCameraPositionPageSpace = {
            x: left + width / 2,
            y: top + height / 2
        }

        // Cursor position, relative to camera position, in screen pixels
        const relativeCursorPositionPageSpace = {
            x: pageX - absoluteCameraPositionPageSpace.x,
            y: pageY - absoluteCameraPositionPageSpace.y
        }

        // Cursor position, relative to camera position, in world units
        const relativeCursorPositionWorldSpace = {
            x: relativeCursorPositionPageSpace.x / zoom,
            y: relativeCursorPositionPageSpace.y / zoom
        }

        // Cursor position in world units
        const absoluteCursorPositionWorldSpace = {
            x: relativeCursorPositionWorldSpace.x + position.x,
            y: relativeCursorPositionWorldSpace.y - position.y
        }

        return [absoluteCursorPositionWorldSpace.x, absoluteCursorPositionWorldSpace.y]
    }, [])

    return callback
}