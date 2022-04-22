import { useRef, useEffect, useCallback } from 'react'
import { useStore } from '$'

export const usePageSpaceToWorldSpace = (): (pageX: number, pageY: number) => [x: number, y: number] => {
    const camera = useRef(useStore.getState().camera)
    useEffect(
        () =>
        useStore.subscribe((state) => {
            camera.current = state.camera
        }),
        []
    )

    const canvas = useStore((state) => state.registry.canvasRoot)

    const callback = useCallback((pageX: number, pageY: number): [x: number, y: number] => {
        const { zoom, position } = camera.current

        const { width, height, left, top } = (canvas.current ?? document.documentElement).getBoundingClientRect()

        // camera position, in screen pixels
        const center = {
            x: left + width / 2,
            y: top + height / 2
        }

        // cursor position, relative to camera position, in screen pixels
        const vec = {
            x: pageX - center.x,
            y: pageY - center.y
        }

        // cursor position, relative to camera position, in world units
        const pos = {
            x: vec.x / zoom,
            y: vec.y / -zoom
        }

        // cursor position in world units
        const mappedPosition = {
            x: pos.x + (position.x / zoom),
            y: pos.y + (position.y / zoom)
        }

        return [mappedPosition.x, mappedPosition.y]
    }, [])

    return callback
}