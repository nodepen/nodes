import { COLORS, DIMENSIONS } from "@/constants"
import { getDomainParameter, getDomainValue } from "@/utils/numerics/domain"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useNodeInternalState } from "../../context/node-state"
import { getMaskKey } from "../utils/getMaskKey"
import { usePageSpaceToWorldSpace } from "@/hooks"
import { clamp } from "@/utils"

const { NODE_PORT_RADIUS } = DIMENSIONS

type Props = {
    // World coordinates
    extents: {
        x: number
        y: number
        w: number
        h: number
    }
    // Normalized 0-1
    limits: {
        x: [min: number, max: number],
        y: [min: number, max: number]
    }
    // Normalized 0-1
    grip: {
        x: number
        y: number
    }
    onUpdate: (x: number, y: number) => void
    onCommit: (x: number, y: number) => void
}

export const GraphMapperCanvasGrip = ({ extents, limits, grip, onUpdate, onCommit }: Props) => {
    const { x, y, w, h } = extents

    const { nodeInstanceId } = useNodeInternalState()

    const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

    const [internalGrip, setInternalGrip] = useState(grip)
    useEffect(() => {
        setInternalGrip(grip)
    }, [grip])

    const pageToGrip = (pageX: number, pageY: number): typeof grip => {
        const [wx, wy] = pageSpaceToWorldSpace(pageX, pageY)

        const tx = getDomainParameter([x, x + w], wx)
        const ty = 1 - getDomainParameter([y, y + h], wy)

        const [minX, maxX] = limits.x
        const [minY, maxY] = limits.y

        return {
            x: clamp(tx, minX, maxX),
            y: clamp(ty, minY, maxY)
        }
    }

    const isDragging = useRef(false)
    const initialPosition = useRef(grip)

    const gripRef = useRef<SVGCircleElement>(null)

    const handlePointerDownCapture = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
        e.stopPropagation()
        gripRef.current?.setPointerCapture(e.pointerId)

        initialPosition.current = internalGrip

        isDragging.current = true
    }, [])

    const handlePointerMove = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
        if (!isDragging.current) {
            return
        }

        const { pageX, pageY } = e

        const { x, y } = pageToGrip(pageX, pageY)

        setInternalGrip({ x, y })
        onUpdate(x, y)
    }, [pageToGrip, onUpdate])

    const handlePointerUp = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
        isDragging.current = false

        const { pageX, pageY } = e

        const { x, y } = pageToGrip(pageX, pageY)

        setInternalGrip({ x, y })
        onCommit(x, y)
    }, [pageToGrip, onCommit])

    const handlePointerCancel = useCallback((_e: React.PointerEvent<SVGCircleElement>) => {
        isDragging.current = false

        const { x, y } = initialPosition.current

        onCommit(x, y)
    }, [onCommit])

    const cx = getDomainValue([x, x + w], internalGrip.x)
    const cy = getDomainValue([y + h, y], internalGrip.y)

    return <g>
        <circle mask={`url(#${getMaskKey(nodeInstanceId)})`} cx={cx + x} cy={cy + y + h} r={NODE_PORT_RADIUS + 3} fill={COLORS.LIGHT} />
        <circle
            ref={gripRef}
            cx={cx + x}
            cy={cy + y + h}
            r={NODE_PORT_RADIUS}
            stroke={COLORS.DARK}
            strokeWidth={2}
            fill={COLORS.LIGHT}
            onPointerDownCapture={handlePointerDownCapture}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className='hover:np-cursor-pointer'
        />
    </g>
}