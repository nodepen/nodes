import type React from 'react'
import { useEffect, useRef, useId } from 'react'
import { useDispatch } from '@/store'

/**
 * Registers a new element that should express the pseudo-shadow effect.
 * @returns The `RefObject` that should be associated with a `div` that represents the extents of the target element.
 */
export const usePseudoShadow = (resizeProxyKey?: string): React.RefObject<HTMLDivElement> => {
  const shadowId = useId()
  const shadowTargetRef = useRef<HTMLDivElement>(null)

  const { apply } = useDispatch()

  useEffect(() => {
    apply((state) => {
      state.registry.shadows.targets[shadowId] = {
        ref: shadowTargetRef,
        resizeProxyKey,
      }
    })

    return () => {
      apply((state) => {
        delete state.registry.shadows.targets[shadowId]
      })
    }
  }, [])

  return shadowTargetRef
}
