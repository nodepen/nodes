import type React from 'react'
import { useEffect, useRef } from 'react'
import { useDispatch } from '@/store'

/**
 * Registers a new element that should express the pseudo-shadow effect.
 * @returns The `RefObject` that should be associated with a `div` that represents the extents of the target element.
 */
export const usePseudoShadow = (): React.RefObject<HTMLDivElement> => {
    const shadowId = useRef<string>(crypto.randomUUID())
    const shadowTargetRef = useRef<HTMLDivElement>(null)

    const { apply } = useDispatch()

    useEffect(() => {
        apply((state) => {
            state.registry.pseudoShadowTargets[shadowId.current] = shadowTargetRef
        })

        return () => {
            apply((state) => {
                delete state.registry.pseudoShadowTargets[shadowId.current]
            })
        }
    }, [])

    return shadowTargetRef
}

