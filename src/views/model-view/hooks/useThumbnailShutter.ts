import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '@/store'

const THUMBNAIL_SETTLE_FRAMES = 2
const PADDING = 1.3

/** Hot flattened isometric angle that went hard in undergrad */
const VIEW_DIRECTION = new THREE.Vector3(0, -1, 0.5).normalize()

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

            const boundingSphere = new THREE.Sphere()
            bounds.getBoundingSphere(boundingSphere)
            const radius = Math.max(boundingSphere.radius, 0.5)

            camera.position.copy(center).addScaledVector(VIEW_DIRECTION, Math.max(radius * 2, 10))
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

            camera.zoom = Math.min(
                (size.width / 2) / (Math.max(halfWidth, MIN_HALF_EXTENT) * PADDING),
                (size.height / 2) / (Math.max(halfHeight, MIN_HALF_EXTENT) * PADDING)
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
