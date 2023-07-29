import type React from 'react'
import { useEffect, useRef, useId, useCallback } from 'react'
import { useDispatch } from '$'
import { useImperativeEvent } from '@/hooks'

/**
 * Registers a new element that should express the pseudo-shadow effect.
 * @returns The `RefObject` that should be associated with a `div` that represents the extents of the target element.
 */
export const usePseudoShadow = (
  resizeProxyKey?: string,
  triggerOnAnimation = true
): React.RefObject<HTMLDivElement> => {
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

  const handleTransitionStart = useCallback((e: TransitionEvent) => {
    if (triggerOnAnimation) {
      return
    }

    e.stopPropagation()
  }, [])

  const handleTransitionEnd = useCallback((e: TransitionEvent) => {
    if (triggerOnAnimation) {
      return
    }

    e.stopPropagation()
  }, [])

  useImperativeEvent(shadowTargetRef, 'transitionstart', handleTransitionStart, true, true)
  useImperativeEvent(shadowTargetRef, 'transitionend', handleTransitionEnd, true, true)

  return shadowTargetRef
}
