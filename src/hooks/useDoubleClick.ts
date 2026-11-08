import { distance } from "@/utils/numerics"
import React, { useCallback, useRef } from "react"
import { useImperativeEvent } from "./useImperativeEvent"

/**
 * Simulated double click from pointer event position and duration.
 */
type PointerDownRecord = {
    pointerId: number
    time: number
    pageX: number
    pageY: number
}

export const useDoubleClick = <T extends HTMLDivElement | SVGGElement | null>(
    onDoubleClick: (e: PointerEvent) => void,
    externalRef?: React.RefObject<T | null>
): React.RefObject<T | null> => {
    const internalRef = useRef<T>(null)

    const targetRef = externalRef ?? internalRef

    const MAX_DISTANCE_DELTA = 6
    const MAX_TIME_DELTA_MS = 500

    const onDoubleClickRef = useRef(onDoubleClick)
    onDoubleClickRef.current = onDoubleClick

    const firstPointerDown = useRef<PointerDownRecord | null>(null)
    const secondPointerDown = useRef<PointerDownRecord | null>(null)

    const reset = useCallback((): void => {
        firstPointerDown.current = null
        secondPointerDown.current = null
    }, [])

    const handlePointerDown = useCallback(
        (e: PointerEvent): void => {
            const { pageX, pageY, pointerType, pointerId, button } = e

            if (pointerType !== 'mouse' || button !== 0) {
                reset()
                return
            }

            const first = firstPointerDown.current
            const current: PointerDownRecord = { pointerId, time: Date.now(), pageX, pageY }

            const isSecondPointerDown = first !== null
                && first.pointerId === current.pointerId
                && current.time - first.time <= MAX_TIME_DELTA_MS
                && distance([current.pageX, current.pageY], [first.pageX, first.pageY]) <= MAX_DISTANCE_DELTA

            if (!isSecondPointerDown) {
                firstPointerDown.current = current
                secondPointerDown.current = null
                return
            }

            // Keep the second press from starting another drag/selection (and from capturing the pointer)
            e.stopPropagation()

            firstPointerDown.current = null
            secondPointerDown.current = current
        },
        []
    )

    const handlePointerUp = useCallback(
        (e: PointerEvent): void => {
            const second = secondPointerDown.current
            secondPointerDown.current = null

            if (second === null || second.pointerId !== e.pointerId || e.button !== 0) {
                return
            }

            const isSecondPointerUpWithinTolerance = distance([e.pageX, e.pageY], [second.pageX, second.pageY]) <= MAX_DISTANCE_DELTA

            if (!isSecondPointerUpWithinTolerance) {
                return
            }

            e.stopPropagation()

            onDoubleClickRef.current(e)
        },
        []
    )

    useImperativeEvent(targetRef, 'pointerdown', handlePointerDown)
    useImperativeEvent(targetRef, 'pointerup', handlePointerUp)
    useImperativeEvent(targetRef, 'pointercancel', reset)

    return targetRef
}
