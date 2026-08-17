import { distance } from "@/utils/numerics"
import React, { useCallback, useRef } from "react"
import { useImperativeEvent } from "./useImperativeEvent"

export const useRightClick = <T extends SVGGElement | null>(
    onRightClick: (e: PointerEvent) => void,
    capture?: boolean,
    externalRef?: React.RefObject<T>
): React.RefObject<T | null> => {
    const internalRef = useRef<T>(null)

    const targetRef = externalRef ?? internalRef

    const MAX_DISTANCE_DELTA = 15
    const MAX_TIME_DELTA_MS = 600

    const currentPointerId = useRef<number>(null)
    const startTime = useRef(Date.now())
    const startPosition = useRef<{ pageX: number, pageY: number }>({ pageX: 0, pageY: 0 })

    const handlePointerDown = useCallback(
        (e: PointerEvent): void => {
            const { pageX, pageY, pointerType, pointerId, button } = e

            if (pointerType !== 'mouse' || button !== 2) {
                return
            }

            if (capture) {
                e.stopPropagation()
                e.stopImmediatePropagation()

                    ; (e.target as SVGGElement).setPointerCapture(e.pointerId)
            }

            currentPointerId.current = pointerId
            startTime.current = Date.now()
            startPosition.current = { pageX, pageY }
        },
        []
    )

    const handlePointerUp = useCallback(
        (e: PointerEvent): void => {
            const { pageX, pageY, pointerType, pointerId, button } = e

            if (pointerType !== 'mouse' || button !== 2 || currentPointerId.current !== pointerId) {
                return
            }

            currentPointerId.current = null

            const timeDelta = Date.now() - startTime.current
            const distanceDelta = distance([pageX, pageY], [startPosition.current.pageX, startPosition.current.pageY])

            if (timeDelta > MAX_TIME_DELTA_MS || distanceDelta > MAX_DISTANCE_DELTA) {
                return
            }

            onRightClick(e)
        },
        [onRightClick]
    )

    useImperativeEvent(targetRef, 'pointerdown', handlePointerDown)
    useImperativeEvent(targetRef, 'pointerup', handlePointerUp)

    return targetRef
}