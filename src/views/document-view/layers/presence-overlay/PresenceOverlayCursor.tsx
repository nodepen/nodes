import React, { startTransition, useId, useRef } from 'react'
import { usePageSpaceToOverlaySpace, useWorldSpaceToPageSpace } from "@/hooks"
import { useStore, useStoreRef } from "@/store"
import { useEffect, useState } from "react"
import { useLerpState } from '@/hooks/useLerpState'
import { COLORS } from '@/constants'
import { lerpPoint2d, useInterpolatedState } from '@/hooks/useInteroplatedState'
import { AgentIcon } from '@/components/icons/AgentIcon'
import { getRandomInteger } from '@/utils/numerics'
import { getRandomFloat, pickRandomItem } from '@/utils/numerics/random'
import { newGuid } from '@/utils/common'

type Props = {
    sessionId: string
}

const PresenceOverlayCursor = ({ sessionId }: Props) => {
    const sessionData = useStoreRef((state) => state.presence.sessions[sessionId])
    const sessionChirp = useStore((state) => state.presence.sessions[sessionId].chirp)

    // DO NOT DELETE: This keeps the cursor illusion up when the camera moves, even though the cursors don't care
    const cameraPosition = useStore((state) => state.camera.position)
    const cameraZoom = useStore((state) => state.camera.zoom)

    const cursor = useStore((state) => state.presence.cursors[sessionId])
    const [visibleCursor, setVisibleCursor] = useInterpolatedState(cursor ?? { x: 0, y: 0 }, lerpPoint2d)

    useEffect(() => {
        if (!cursor) {
            return
        }
        setVisibleCursor(cursor)
    }, [cursor?.x, cursor?.y])

    const worldSpaceToPageSpace = useWorldSpaceToPageSpace()
    const pageSpaceToOverlaySpace = usePageSpaceToOverlaySpace()

    const [pageX, pageY] = worldSpaceToPageSpace(visibleCursor.x, visibleCursor.y)
    const [left, top] = pageSpaceToOverlaySpace(pageX, pageY)

    if (!cursor) return null

    const isAgentCursor = sessionData.current.kind === 'agent'

    return <>
        <div className='np-absolute np-z-20 np-overflow-visible' style={{ left: `${left}px`, top: `${top}px` }}>
            <svg width="24" height="24" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className='np-z-20 np-overflow-visible'>
                {isAgentCursor ? <path d="M1.95446 1.30276L14.78282 5.35641Q15.7363 5.65771 14.81192 6.03921L9.37012 8.28467C8.87808 8.48771 8.48722 8.87857 8.28418 9.37061L6.03873 14.81241Q5.65723 15.7368 5.35593 14.78332L1.30228 1.95494Q1.00098 1.00146 1.95446 1.30276Z" fill="none" stroke={COLORS.PALE} strokeWidth="6" vectorEffect='non-scaling-stroke' /> : null}
                <path d="M1.95446 1.30276L14.78282 5.35641Q15.7363 5.65771 14.81192 6.03921L9.37012 8.28467C8.87808 8.48771 8.48722 8.87857 8.28418 9.37061L6.03873 14.81241Q5.65723 15.7368 5.35593 14.78332L1.30228 1.95494Q1.00098 1.00146 1.95446 1.30276Z" fill={sessionData.current.color} stroke={COLORS.DARK} strokeWidth="2" vectorEffect='non-scaling-stroke' />
                {/* <path d="M1.00098 1.00146L15.7363 5.65771L9.37012 8.28467C8.87808 8.48771 8.48722 8.87857 8.28418 9.37061L5.65723 15.7368L1.00098 1.00146Z" fill="white" stroke={COLORS.DARK} strokeWidth="2" vectorEffect='non-scaling-stroke' /> */}
            </svg>
        </div>
        {isAgentCursor ? (
            <div
                className='np-absolute np-w-10 np-h-10 np-z-10'
                style={{ left: `${left - 8}px`, top: `${top - 8}px` }}
            >
                <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className='np-overflow-visible'>
                    <PresenceOverlayAgentBackground sessionId={sessionId} />
                </svg>
            </div>
        ) : null}
        {isAgentCursor ? (
            <div
                className='np-absolute np-flex np-h-8'
                style={{ left: `${left + 24}px`, top: `${top - 16}px` }}
            >
                <PresenceOverlayChirpMessage text={sessionChirp} />
            </div>
        ) : null}
    </>
}

type ChirpProps = {
    text?: string
}

const PresenceOverlayChirpMessage = ({ text }: ChirpProps) => {
    const [showText, setShowText] = useState(() => !!text)

    const hideTimeout = useRef<ReturnType<typeof setTimeout>>(null)

    useEffect(() => {
        if (!text) {
            setShowText(false)
            return
        }

        setShowText(true)

        hideTimeout.current = setTimeout(() => {
            setShowText(false)
        }, 5_000)

        return () => {
            if (hideTimeout.current) {
                clearTimeout(hideTimeout.current)
            }
        }
    }, [text])

    if (!showText) {
        return null
    }

    return <div className='np-flex np-items-center np-px-2 np-py-1 np-rounded-full np-bg-pale'>
        <p className='np-text-xs np-text-darkgreen np-font-panel'>{text}</p>
    </div>
}

const PresenceOverlayAgentBackground = ({ sessionId }: Props) => {
    const status = useStore((state) => state.presence.sessions[sessionId].status)

    const [graphics, setGraphics] = useState<Graphic[]>([])

    const VALID_ROTATIONS = [0, 45] as const
    const VALID_SIZE_DOMAIN = [1, 3] as const

    const addGraphicInterval = useRef<ReturnType<typeof setInterval>>(null)

    useEffect(() => {
        const speed = status === 'working' ? 700 : 2500

        addGraphicInterval.current = setInterval(() => {
            const key = newGuid()

            const rotation = pickRandomItem(VALID_ROTATIONS)
            const size = getRandomFloat(VALID_SIZE_DOMAIN[0], VALID_SIZE_DOMAIN[1])
            const x = getRandomFloat(0, 20)
            const y = getRandomFloat(0, 20)

            setGraphics((gi) => [
                ...gi,
                {
                    key,
                    type: 'sparkle',
                    props: {
                        position: { x, y },
                        rotation,
                        size,
                        onEnd: () => {
                            setGraphics((gj) => gj.filter((gk) => gk.key !== key))
                        }
                    }
                }
            ])
        }, speed)

        return () => {
            if (addGraphicInterval.current) {
                clearInterval(addGraphicInterval.current)
            }
        }
    }, [status])

    return <>
        {graphics.map((graphic) => {
            switch (graphic.type) {
                case 'sparkle': {
                    return <Sparkle key={`graphic-sparkle-${graphic.key}`} {...graphic.props} />
                }
            }
        })}
    </>
}

type Graphic =
    { key: string } & (
        | {
            type: 'sparkle',
            props: SparkleProps
        }
    )

type SparkleProps = {
    position: { x: number, y: number },
    size: number
    rotation: 0 | 45
    onEnd: () => void
}

const Sparkle = ({ position, size, rotation, onEnd }: SparkleProps) => {
    const { x, y } = position

    useEffect(() => {
        const timer = setTimeout(onEnd, 3000)
        return () => clearTimeout(timer)
    }, [])

    const lineStyle = {
        '--dash': size,
        strokeDasharray: size,
        animation: 'sparkle-march 1500ms ease-in',
        animationFillMode: 'backwards',
    } as React.CSSProperties

    const lines = [
        { x1: x, y1: y, x2: x, y2: y + size },
        { x1: x, y1: y, x2: x, y2: y - size },
        { x1: x, y1: y, x2: x + size, y2: y },
        { x1: x, y1: y, x2: x - size, y2: y },
    ]

    return (
        <g style={{ transform: `rotate(${rotation}deg)`, transformBox: 'fill-box', transformOrigin: 'center' }}>
            {lines.map((line, i) => (
                <line
                    key={i}
                    {...line}
                    stroke={COLORS.DARK}
                    strokeWidth={1}
                    strokeLinecap='round'
                    style={lineStyle}
                />
            ))}
        </g>
    )
}

export default React.memo(PresenceOverlayCursor)