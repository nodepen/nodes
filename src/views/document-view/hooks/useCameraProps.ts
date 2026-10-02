import type React from 'react'
import { useStore } from '$'
import { getCameraOverdraw, getCameraTranslation } from '@/store/utils'

type CameraProps = {
    width: string
    height: string
    viewBox: string
    style: React.CSSProperties
    /** The `viewBox` as numbers, for content that has to cover it (the grid). */
    extents: {
        x: number
        y: number
        width: number
        height: number
    }
}

/**
 * Root svg props for the current camera.
 */
export const useCameraProps = (): CameraProps => {
    const camera = useStore((state) => state.camera)

    const { anchor, viewport, zoom } = camera

    const overdraw = getCameraOverdraw(viewport)

    const w = viewport.width + overdraw.x * 2
    const h = viewport.height + overdraw.y * 2

    // overdraw
    const extents = {
        x: w / 2 / -zoom + anchor.x,
        y: h / 2 / -zoom - anchor.y,
        width: w / zoom,
        height: h / zoom,
    }

    // anchor-based transform
    const translation = getCameraTranslation(camera)

    return {
        width: `${w}px`,
        height: `${h}px`,
        viewBox: [extents.x, extents.y, extents.width, extents.height].join(' '),
        style: {
            position: 'absolute',
            left: `${-overdraw.x}px`,
            top: `${-overdraw.y}px`,
            transform: `translate3d(${translation.x}px, ${translation.y}px, 0)`,
            willChange: 'transform',
        },
        extents,
    }
}
