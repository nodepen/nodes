import { CAMERA } from '@/constants'
import type { NodesAppState } from '../state'

type Camera = NodesAppState['camera']

/**
 * How far past the container, in screen pixels, the canvas svgs extend on each side.
 */
export const getCameraOverdraw = (viewport: Camera['viewport']): { x: number; y: number } => {
    return {
        x: Math.round(viewport.width * CAMERA.OVERDRAW),
        y: Math.round(viewport.height * CAMERA.OVERDRAW),
    }
}

/**
 * The screen space offset, in pixels, between where the scene is currently drawn (`anchor`) and
 * where the camera actually is (`position`). Applied to the canvas svgs as a css transform.
 */
export const getCameraTranslation = (camera: Camera): { x: number; y: number } => {
    const { anchor, position, zoom } = camera

    return {
        x: (anchor.x - position.x) * zoom,
        y: (position.y - anchor.y) * zoom,
    }
}

/**
 * Redraw the scene around the camera's current position, clearing the pan transform.
 */
export const commitCameraAnchor = (state: NodesAppState): void => {
    const { x, y } = state.camera.position

    if (state.camera.anchor.x === x && state.camera.anchor.y === y) {
        return
    }

    state.camera.anchor = { x, y }
}

/**
 * Commit the anchor only if the pan has travelled far enough that the overdrawn scene is about
 * to run out. Called on every frame of a pan; a no-op for all but a handful of them.
 */
export const handleOverdrawLimit = (state: NodesAppState): void => {
    const translation = getCameraTranslation(state.camera)
    const overdraw = getCameraOverdraw(state.camera.viewport)

    if (Math.abs(translation.x) < overdraw.x && Math.abs(translation.y) < overdraw.y) {
        return
    }

    commitCameraAnchor(state)
}
