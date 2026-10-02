import { useCallback, type RefObject } from 'react'
import * as THREE from 'three'
import type { ThreeViewer } from '@selvajs/visualization/render'
import { useStore } from '@/store'
import { useFlag } from '@/hooks/useFlag'

const THUMBNAIL_SETTLE_FRAMES = 2
const PADDING = 1.3

/** Hot flattened isometric angle that went hard in undergrad */
const VIEW_DIRECTION = new THREE.Vector3(0, -1, 0.5).normalize()

/** Straight overhead, for a subject with no depth to show. */
const FLAT_VIEW_DIRECTION = new THREE.Vector3(0, 0, 1)

/** The scene's own up, which every view but the straight-down one is oriented by. */
const UP = new THREE.Vector3(0, 0, 1)

/** Up on screen when looking straight down. */
const FLAT_UP = new THREE.Vector3(0, 1, 0)

/** Smaller is flattier */
const FLAT_TOLERANCE = 0.01

/** Tighter than PADDING for 3D views */
const FLAT_PADDING = 1.08

export const getThumbnailViewDirection = (bounds: THREE.Box3): { direction: THREE.Vector3, isFlat: boolean } => {
    const extents = new THREE.Vector3()
    bounds.getSize(extents)

    const isFlat = extents.z <= Math.max(extents.x, extents.y) * FLAT_TOLERANCE

    return {
        direction: (isFlat ? FLAT_VIEW_DIRECTION : VIEW_DIRECTION).clone(),
        isFlat
    }
}

export const frameOrthographicCamera = (camera: THREE.OrthographicCamera, bounds: THREE.Box3): void => {
    if (bounds.isEmpty()) {
        return
    }

    const center = new THREE.Vector3()
    bounds.getCenter(center)

    const boundingSphere = new THREE.Sphere()
    bounds.getBoundingSphere(boundingSphere)
    const radius = Math.max(boundingSphere.radius, 0.5)

    const { direction, isFlat } = getThumbnailViewDirection(bounds)

    camera.up.copy(isFlat ? FLAT_UP : UP)

    camera.position
        .copy(center)
        .addScaledVector(direction, Math.max(radius * 2, 10))
    camera.lookAt(center)

    camera.updateMatrixWorld(true)

    const corner = new THREE.Vector3()
    let halfWidth = 0
    let halfHeight = 0

    for (let i = 0; i < 8; i++) {
        corner.set(
            i & 1 ? bounds.max.x : bounds.min.x,
            i & 2 ? bounds.max.y : bounds.min.y,
            i & 4 ? bounds.max.z : bounds.min.z
        ).applyMatrix4(camera.matrixWorldInverse)

        halfWidth = Math.max(halfWidth, Math.abs(corner.x))
        halfHeight = Math.max(halfHeight, Math.abs(corner.y))
    }

    const MIN_HALF_EXTENT = 1e-3
    const padding = isFlat ? FLAT_PADDING : PADDING

    const frustumHalfWidth = (camera.right - camera.left) / 2
    const frustumHalfHeight = (camera.top - camera.bottom) / 2

    camera.zoom = Math.min(
        frustumHalfWidth / (Math.max(halfWidth, MIN_HALF_EXTENT) * padding),
        frustumHalfHeight / (Math.max(halfHeight, MIN_HALF_EXTENT) * padding)
    )
    camera.near = Math.min(camera.near, 0.01)
    camera.far = Math.max(camera.far, radius * 4 + 10)
    camera.updateProjectionMatrix()
}

const waitFrames = (count: number): Promise<void> => {
    return new Promise((resolve) => {
        const step = (remaining: number) => {
            if (remaining <= 0) {
                resolve()
                return
            }

            requestAnimationFrame(() => {
                step(remaining - 1)
            })
        }

        step(count)
    })
}

export type ThumbnailSubject = 'solution' | 'context'

/** The part of `THREE.Box3` this needs. */
export type ShotBounds = {
    isEmpty(): boolean
    union(other: ShotBounds): unknown
    clone(): ShotBounds
}

export type ThumbnailExpectation = {
    /** How many reference models are attached, each of which will offer once. */
    expectedContextCount: number
    /** Whether a solution model is on its way, which is framed ahead of any context. */
    isSolutionModelExpected: boolean
}

type SubjectOffer = {
    bounds: ShotBounds
    signal: () => void
}

type ThumbnailShot = {
    /** Set once the solution model has loaded and turned out to have no geometry in it. */
    isSolutionEmpty: boolean
    /** Union of all context models' bounds so far. */
    currentContext: SubjectOffer | null
    /** How many context offers have arrived, against how many models are attached. */
    contextOffers: number
}

/** The state of the one thumbnail being taken. */
const thumbnailShot: ThumbnailShot = {
    isSolutionEmpty: false,
    currentContext: null,
    contextOffers: 0,
}

export const resetThumbnailShot = (): void => {
    thumbnailShot.isSolutionEmpty = false
    thumbnailShot.currentContext = null
    thumbnailShot.contextOffers = 0
}

export const offerThumbnailSubject = <B extends ShotBounds>(
    subject: ThumbnailSubject,
    bounds: B,
    signal: () => void,
    frame: (bounds: B, signal: () => void) => void,
    expectation: ThumbnailExpectation
): void => {
    const { expectedContextCount, isSolutionModelExpected } = expectation

    if (subject === 'solution') {
        if (!bounds.isEmpty()) {
            frame(bounds, signal)
            return
        }

        thumbnailShot.isSolutionEmpty = true

        if (thumbnailShot.currentContext) {
            frame(thumbnailShot.currentContext.bounds as B, thumbnailShot.currentContext.signal)
            return
        }

        if (expectedContextCount === 0) {
            frame(bounds, signal)
        }

        return
    }

    thumbnailShot.contextOffers += 1

    const held = thumbnailShot.currentContext

    if (held) {
        held.bounds.union(bounds)
    } else {
        thumbnailShot.currentContext = { bounds: bounds.clone(), signal }
    }

    const context = thumbnailShot.currentContext!

    const isSolutionComing = isSolutionModelExpected && !thumbnailShot.isSolutionEmpty

    if (isSolutionComing) {
        return
    }

    if (thumbnailShot.contextOffers < expectedContextCount) {
        return
    }

    frame(context.bounds as B, context.signal)
}

/**
 * Frames the viewer for a thumbnail once its subjects have loaded, then fires `onThumbnailReady`.
 * Does nothing unless the `isThumbnail` flag is set.
 */
export const useThumbnailShutter = (viewerRef: RefObject<ThreeViewer | null>) => {
    const isThumbnail = useFlag('isThumbnail')

    return useCallback((subject: ThumbnailSubject, bounds: THREE.Box3) => {
        const viewer = viewerRef.current

        if (!viewer || !isThumbnail) {
            return
        }

        const frame = (target: THREE.Box3, signal: () => void) => {
            if (!target.isEmpty()) {
                viewer.cameraController.setProjection('orthographic')

                const camera = viewer.cameraController.getActiveCamera()

                if (camera instanceof THREE.OrthographicCamera) {
                    frameOrthographicCamera(camera, target)

                    viewer.controls.target.copy(target.getCenter(new THREE.Vector3()))
                    viewer.controls.update()
                }
            }

            viewer.invalidate()

            waitFrames(THUMBNAIL_SETTLE_FRAMES).then(() => {
                if (viewerRef.current === viewer) {
                    signal()
                }
            })
        }

        const signal = () => {
            const state = useStore.getState()
            state.callbacks.onThumbnailReady?.(state)
        }

        const { solution, attachments } = useStore.getState()

        offerThumbnailSubject(subject, bounds, signal, frame, {
            expectedContextCount: Object.keys(attachments.reference_model ?? {}).length,
            isSolutionModelExpected: !!solution.data?.solutionModelUrl
        })
    }, [viewerRef, isThumbnail])
}
