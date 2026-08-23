import { COLORS } from "@/constants"
import { useDocumentRef, useImperativeEvent } from "@/hooks"
import { useLerpState } from "@/hooks/useLerpState"
import { distance } from "@/utils/numerics"
import React, { useCallback, useRef, useState } from "react"
import { AgentSparkleIcon } from "../icons/AgentSparkleIcon"
import { CircleButton } from "../layout/CircleButton"

type Props = {
    onClick: () => void
    isOpen: boolean
}

const HelpButton = ({ onClick, isOpen }: Props) => {
    const documentRef = useDocumentRef()
    const circleAnnotationRef = useRef<HTMLDivElement>(null)

    const [circleScale, setCircleScale] = useLerpState(1, 0.1)

    const handlePointerMove = useCallback((e: PointerEvent) => {
        const { pageX: pointerX, pageY: pointerY } = e

        if (!circleAnnotationRef.current) {
            return
        }

        const { width, height, left, top } = circleAnnotationRef.current.getBoundingClientRect()
        const centerX = left + width / 2
        const centerY = top + height / 2

        const dist = distance([pointerX, pointerY], [centerX, centerY])

        setCircleScale(dist < 50 ? 1.3 : 1)
    }, [])

    useImperativeEvent(documentRef, 'pointermove', handlePointerMove)

    const r = isOpen ? 0.1 : 4.75 * circleScale
    const c = Math.PI * 2 * r + (2 * circleScale)
    const dist = c / 4
    const dashArray = `2 ${dist - 2}`

    const handleClick = () => {
        onClick()
    }

    return (
        <div ref={circleAnnotationRef} className='np-w-12 np-h-12 -np-mr-2 np-relative np-overflow-visible np-z-10' style={{ transform: 'translateY(-8px)' }}>
            <div className="np-absolute np-z-0 np-w-full np-h-full">
                <svg className="np-w-12 np-h-12 np-overflow-visible np-animate-march-rotate" viewBox="0 0 10 10" style={{ animationDuration: '20000ms' }}>
                    <circle cx={5} cy={5} r={r + 1} fill={COLORS.PALE} stroke="none" />
                    <circle cx={5} cy={5} r={r} fill="none" stroke={COLORS.DARK} strokeWidth={2 + (circleScale - 1) * 10} strokeDasharray={dashArray} vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
            <div className='np-w-full np-h-full np-absolute np-flex np-items-center np-justify-center np-z-10 np-overflow-visible'>
                <CircleButton shadow tooltip="Agent" onClick={handleClick}>
                    <AgentSparkleIcon width={16} height={16} fill={COLORS.DARK} />
                </CircleButton>
            </div>
        </div>

    )
}

export default React.memo(HelpButton)