import { useEffect } from 'react'
import { useDispatch, useStore } from '$'
import { commitCameraAnchor } from '@/store/utils'

/**
 * Keeps `camera.viewport` in sync with the container div (resize).
 */
export const useCameraViewport = (): void => {
    const containerRef = useStore((state) => state.registry.canvasRoot)

    const { apply } = useDispatch()

    useEffect(() => {
        const element = containerRef.current

        if (!element) {
            return
        }

        const observer = new ResizeObserver(() => {
            const { width, height } = element.getBoundingClientRect()

            apply((state) => {
                const { viewport } = state.camera

                if (viewport.width === width && viewport.height === height) {
                    return
                }

                state.camera.viewport = { width, height }

                commitCameraAnchor(state)
            })
        })

        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [])
}
