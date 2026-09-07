import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '@/store'

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

type PendingThumbnail = {
    signal: () => void
    framesRemaining: number | null
}

type ThumbnailSubject = 'solution' | 'context'

type SubjectOffer = {
    bounds: THREE.Box3
    signal: () => void
}

const shot: {
    /** Set once the solution model has loaded and turned out to have no geometry in it. */
    isSolutionEmpty: boolean
    /** Held while the solution model is still out, in case it comes back with nothing. */
    heldContext: SubjectOffer | null
} = {
    isSolutionEmpty: false,
    heldContext: null,
}

export const useThumbnailShutter = (mountedGeometry: unknown) => {
    const { camera, size, invalidate } = useThree()

    const pending = useRef<PendingThumbnail | null>(null)

    const frameOn = useCallback((bounds: THREE.Box3, signal: () => void): void => {
        if (!bounds.isEmpty() && camera instanceof THREE.OrthographicCamera) {
            const center = new THREE.Vector3()
            bounds.getCenter(center)

            const extents = new THREE.Vector3()
            bounds.getSize(extents)

            const boundingSphere = new THREE.Sphere()
            bounds.getBoundingSphere(boundingSphere)
            const radius = Math.max(boundingSphere.radius, 0.5)

            const isFlat = extents.z <= Math.max(extents.x, extents.y) * FLAT_TOLERANCE

            camera.up.copy(isFlat ? FLAT_UP : UP)

            camera.position
                .copy(center)
                .addScaledVector(isFlat ? FLAT_VIEW_DIRECTION : VIEW_DIRECTION, Math.max(radius * 2, 10))
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

            camera.zoom = Math.min(
                (size.width / 2) / (Math.max(halfWidth, MIN_HALF_EXTENT) * padding),
                (size.height / 2) / (Math.max(halfHeight, MIN_HALF_EXTENT) * padding)
            )
            camera.updateProjectionMatrix()
        }

        pending.current = { signal, framesRemaining: null }
    }, [camera, size])

    const offerSubject = useCallback((
        subject: ThumbnailSubject,
        bounds: THREE.Box3,
        signal: () => void
    ): void => {
        const { solution, assets } = useStore.getState()

        const isContextExpected = Object.keys(assets.models).length > 0

        if (subject === 'solution') {
            if (!bounds.isEmpty()) {
                frameOn(bounds, signal)
                return
            }

            shot.isSolutionEmpty = true

            if (shot.heldContext) {
                frameOn(shot.heldContext.bounds, shot.heldContext.signal)
                return
            }

            if (!isContextExpected) {
                frameOn(bounds, signal)
            }

            return
        }

        if (!solution.data?.solutionModelUrl || shot.isSolutionEmpty) {
            frameOn(bounds, signal)
            return
        }

        shot.heldContext = { bounds, signal }
    }, [frameOn])

    useEffect(() => {
        const current = pending.current

        if (!current || current.framesRemaining !== null) {
            return
        }

        current.framesRemaining = THUMBNAIL_SETTLE_FRAMES

        invalidate()
    }, [mountedGeometry, invalidate])

    useFrame(() => {
        const current = pending.current

        if (!current || current.framesRemaining === null) {
            return
        }

        if (current.framesRemaining > 0) {
            current.framesRemaining--
            invalidate()
            return
        }

        pending.current = null
        current.signal()
    })

    return offerSubject
}
