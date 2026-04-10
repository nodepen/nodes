
import { useCallback } from 'react'
import { useStore, useStoreRef } from '$'

/**
 * Get a stable reference to a function that can map a position in world space to its position in browser page space.
 * @remarks Guarantees latest values for camera and canvas div geometry without causing re-renders.
 */
export const useWorldSpaceToPageSpace = (): ((worldX: number, worldY: number) => [x: number, y: number]) => {
    const camera = useStoreRef((state) => state.camera)

    const canvas = useStore((state) => state.registry.canvasRoot)

    const callback = useCallback((worldX: number, worldY: number): [x: number, y: number] => {
        const { zoom, position } = camera.current

        const { width, height, left, top } = (canvas.current ?? document.documentElement).getBoundingClientRect()

        // Current camera position in page space (aka canvas div center)
        const absoluteCameraPositionPageSpace = {
            x: left + width / 2,
            y: top + height / 2,
        }

        // World position relative to camera position, in world units
        const relativePositionWorldSpace = {
            x: worldX - position.x,
            y: worldY + position.y,
        }

        // Relative world units converted to page pixels
        const relativePositionPageSpace = {
            x: relativePositionWorldSpace.x * zoom,
            y: relativePositionWorldSpace.y * zoom,
        }

        return [
            absoluteCameraPositionPageSpace.x + relativePositionPageSpace.x,
            absoluteCameraPositionPageSpace.y + relativePositionPageSpace.y,
        ]
    }, [])

    return callback
}
