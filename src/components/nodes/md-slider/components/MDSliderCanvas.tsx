import type * as NodePen from '@/types'
import { COLORS, DIMENSIONS } from '@/constants'
import { useNodeInternalState } from '../../context/node-state'
import { getDomainParameter, getDomainValue, remap } from '@/utils/numerics/domain'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePageSpaceToWorldSpace } from '@/hooks'
import { clamp } from '@/utils'

const { NODE_INTERNAL_PADDING, NODE_PORT_RADIUS, NODE_VALUE_FONT_SIZE } = DIMENSIONS

export type MDSliderPoint = {
    x: number
    y: number
}

export type MDSliderDomains = Pick<NodePen.MDSliderConfig, 'x' | 'y'>

type MDSliderCanvasProps = {
    node: NodePen.DocumentNode
    value: MDSliderPoint
    domains: MDSliderDomains
    onChange: (next: MDSliderPoint) => void
    onCommit: (next: MDSliderPoint) => void
}

export const MDSliderCanvas = ({ node, value, domains, onChange, onCommit }: MDSliderCanvasProps) => {
    const { position } = useNodeInternalState()

    const circleRef = useRef<SVGCircleElement>(null)

    const pageSpaceToWorldSpace = usePageSpaceToWorldSpace()

    const { width, height } = node.dimensions

    const o = 2 * NODE_INTERNAL_PADDING

    const x = position.x + o
    const y = position.y + o

    const w = width - 2 * o
    const h = height - 2 * o

    const tx = getDomainParameter([domains.x.min, domains.x.max], value.x)
    const ty = getDomainParameter([domains.y.min, domains.y.max], value.y)

    const cr = NODE_PORT_RADIUS
    const r = cr + 2 + 2

    const labelRef = useRef<SVGTextElement>(null)
    const [label, setLabel] = useState('')
    useEffect(() => {
        setLabel(`${value.x.toFixed(3)}, ${value.y.toFixed(3)}`)
    }, [value])
    const [labelWidth, setLabelWidth] = useState(0)
    useEffect(() => {
        setLabelWidth((labelRef.current?.getComputedTextLength() ?? (w - 4)) + 4)
    }, [label])

    const labelX = x + w / 2
    const labelY = ty > 0.5
        ? y + (r / 2) + 6
        : y + h - r

    // Interactive area is inset from visible border so circle stays in-bounds
    const worldDomainX: [min: number, max: number] = [
        x + r,
        x + w - r
    ]
    const worldDomainY: [min: number, max: number] = [
        y + r,
        y + h - r
    ]

    const innerW = worldDomainX[1] - worldDomainX[0]
    const innerH = worldDomainY[1] - worldDomainY[0]

    const px = x + r + innerW * tx
    const py = y + r + innerH * ty

    // World coordinates to point value
    const worldToValue = (worldPoint: MDSliderPoint): MDSliderPoint => {
        const { x: wx, y: wy } = worldPoint

        const [minWorldX, maxWorldX] = worldDomainX
        const [minWorldY, maxWorldY] = worldDomainY

        const worldX = clamp(wx, minWorldX, maxWorldX)
        const worldY = clamp(wy, minWorldY, maxWorldY)

        const x = remap(worldDomainX, [domains.x.min, domains.x.max], worldX)
        const y = remap(worldDomainY, [domains.y.min, domains.y.max], worldY)

        return { x, y }
    }

    // Page coordinates to point value
    const pageToValue = (pagePoint: MDSliderPoint): MDSliderPoint => {
        const { x: px, y: py } = pagePoint

        const [wx, wy] = pageSpaceToWorldSpace(px, py)

        return worldToValue({ x: wx, y: wy })
    }

    const isDraggingPoint = useRef(false)
    const initialWorldPosition = useRef<MDSliderPoint>({ x: 0, y: 0 })

    const handlePointerDownCapture = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
        e.stopPropagation()
        circleRef.current?.setPointerCapture(e.pointerId)

        // Track initial position in world space
        const [wx, wy] = pageSpaceToWorldSpace(e.pageX, e.pageY)
        initialWorldPosition.current = { x: wx, y: wy }

        isDraggingPoint.current = true
    }, [pageSpaceToWorldSpace])

    const handlePointerMove = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
        if (!isDraggingPoint.current) {
            return
        }

        // Map pointer to current world space
        const { x, y } = pageToValue({ x: e.pageX, y: e.pageY })

        // Move point the delta in world space
        onChange({ x, y })
    }, [pageToValue, onChange])

    const handlePointerUp = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
        // Commit current state
        onCommit(pageToValue({ x: e.pageX, y: e.pageY }))

        // Reset
        isDraggingPoint.current = false
    }, [onCommit, pageToValue])

    const handlePointerCancel = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
        // Reset to initial state
        onCommit(initialWorldPosition.current)

        // Reset
        isDraggingPoint.current = false
    }, [])

    return (
        <g id={`md-slider-canvas-${node.instanceId}`}>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={COLORS.LIGHT}
                stroke={COLORS.DARK}
                strokeWidth={2}
            />
            {/* Interactive area */}
            {/* <rect
                x={worldDomainX[0]}
                y={worldDomainY[0]}
                width={w - 2 * r}
                height={h - 2 * r}
                fill={COLORS.GREY}
            /> */}
            {/* Axis X */}
            <line
                x1={px}
                y1={y + 3}
                x2={px}
                y2={py - cr - 3}
                stroke={COLORS.DARK}
                strokeWidth={2}
                strokeLinecap='butt'
            />
            <line
                x1={px}
                y1={py + cr + 3}
                x2={px}
                y2={y + h - 3}
                stroke={COLORS.DARK}
                strokeWidth={2}
                strokeLinecap='butt'
            />
            <line
                x1={px}
                y1={y - 1}
                x2={px}
                y2={y + 3}
                stroke={COLORS.LIGHT}
                strokeWidth={6}
                strokeLinecap='butt'
            />
            <line
                x1={px}
                y1={y - 1}
                x2={px}
                y2={y + 1}
                stroke={COLORS.DARK}
                strokeWidth={2}
                strokeLinecap='butt'
            />
            <line
                x1={px}
                y1={y + h + 1}
                x2={px}
                y2={y + h - 3}
                stroke={COLORS.LIGHT}
                strokeWidth={6}
                strokeLinecap='butt'
            />
            <line
                x1={px}
                y1={y + h + 1}
                x2={px}
                y2={y + h - 1}
                stroke={COLORS.DARK}
                strokeWidth={2}
                strokeLinecap='butt'
            />
            {/* Axis Y */}
            <line
                x1={x + 3}
                y1={py}
                x2={px - cr - 3}
                y2={py}
                stroke={COLORS.DARK}
                strokeWidth={2}
                strokeLinecap='butt'
            />
            <line
                x1={px + cr + 3}
                y1={py}
                x2={x + w - 3}
                y2={py}
                stroke={COLORS.DARK}
                strokeWidth={2}
                strokeLinecap='butt'
            />
            <line
                x1={x - 1}
                y1={py}
                x2={x + 3}
                y2={py}
                stroke={COLORS.LIGHT}
                strokeWidth={6}
                strokeLinecap='butt'
            />
            <line
                x1={x - 1}
                y1={py}
                x2={x + 1}
                y2={py}
                stroke={COLORS.DARK}
                strokeWidth={2}
                strokeLinecap='butt'
            />
            <line
                x1={x + w + 1}
                y1={py}
                x2={x + w - 3}
                y2={py}
                stroke={COLORS.LIGHT}
                strokeWidth={6}
                strokeLinecap='butt'
            />
            <line
                x1={x + w + 1}
                y1={py}
                x2={x + w - 1}
                y2={py}
                stroke={COLORS.DARK}
                strokeWidth={2}
                strokeLinecap='butt'
            />
            {/* Label */}
            <rect
                x={x + (w / 2) - (labelWidth / 2)}
                y={labelY - 2 - NODE_VALUE_FONT_SIZE / 2}
                width={labelWidth}
                height={NODE_VALUE_FONT_SIZE + 2}
                fill={COLORS.LIGHT}
                stroke={COLORS.LIGHT}
                strokeWidth={2}
                rx={4}
                ry={4}
            />
            <text
                ref={labelRef}
                className='np-font-sans np-select-none np-pointer-events-none'
                x={labelX}
                y={labelY}
                dominantBaseline='middle'
                textAnchor='middle'
                fill={COLORS.DARK}
                fontSize={NODE_VALUE_FONT_SIZE}
            >
                {label}
            </text>
            {/* <circle
                cx={px}
                cy={py}
                r={cr + 2}
                stroke={COLORS.LIGHT}
                strokeWidth={2}
                fill={COLORS.LIGHT}
            /> */}
            {/* Control point */}
            <circle
                ref={circleRef}
                cx={px}
                cy={py}
                r={cr}
                fill={COLORS.LIGHT}
                stroke={COLORS.DARK}
                strokeWidth={2}
                onPointerDownCapture={handlePointerDownCapture}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                className='hover:np-cursor-pointer'
            />
        </g>
    )
}
