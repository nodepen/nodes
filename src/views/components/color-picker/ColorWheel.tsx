import React, { useCallback, useEffect, useRef, useState } from 'react'
import { COLORS } from '@/constants'
import { hsvToRgb, rgbToHsv, type RGB } from '@/utils/color'

type ColorWheelProps = {
    value: RGB
    onChange: (value: RGB) => void
}

type WheelSwatch = {
    x: number
    y: number
    hue: number
    rgb: RGB
}

type Point = { x: number; y: number }

const CONTAINER_PX = 192
const VIEW_SIZE = 200
const PX_PER_UNIT = CONTAINER_PX / VIEW_SIZE
const CENTER = VIEW_SIZE / 2

const RING_COUNT = 12
const SWATCH_RADIUS_PX = 14
const SWATCH_GAP_PX = 2

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180
const normalizeDegrees = (degrees: number): number => ((degrees % 360) + 360) % 360
const pxToUnits = (px: number): number => px / PX_PER_UNIT

const SWATCH_RADIUS = pxToUnits(SWATCH_RADIUS_PX)

// chord(ringRadius) = 2 * swatchRadius + gap
const chordFactor = 2 * Math.sin(Math.PI / RING_COUNT)
const RING_RADIUS = (2 * SWATCH_RADIUS + pxToUnits(SWATCH_GAP_PX)) / chordFactor
const MAX_RADIUS = RING_RADIUS

const PUCK_BLACK_WIDTH_PX = 2
const PUCK_WHITE_WIDTH_PX = 2
const PUCK_OUTER_WHITE_RADIUS = pxToUnits(SWATCH_RADIUS_PX + PUCK_WHITE_WIDTH_PX)
const PUCK_BLACK_RADIUS = pxToUnits(SWATCH_RADIUS_PX)
const PUCK_INNER_WHITE_RADIUS = pxToUnits(SWATCH_RADIUS_PX - PUCK_BLACK_WIDTH_PX)
const PUCK_FILL_RADIUS = pxToUnits(SWATCH_RADIUS_PX - PUCK_BLACK_WIDTH_PX - PUCK_WHITE_WIDTH_PX)

const polarToPoint = (hue: number, saturation: number): Point => {
    const angleRad = toRadians(hue)
    const radius = saturation * MAX_RADIUS

    return {
        x: CENTER + radius * Math.cos(angleRad),
        y: CENTER + radius * Math.sin(angleRad),
    }
}

const WHEEL_SWATCHES: WheelSwatch[] = Array.from({ length: RING_COUNT }, (_, i) => {
    const hue = normalizeDegrees(-90 + (360 / RING_COUNT) * i)
    const { x, y } = polarToPoint(hue, 1)

    return { x, y, hue, rgb: hsvToRgb({ h: hue, s: 1, v: 1 }) }
})

const isSameColor = (a: RGB, b: RGB): boolean => a.r === b.r && a.g === b.g && a.b === b.b

export const ColorWheel = ({ value, onChange }: ColorWheelProps) => {
    const svgRef = useRef<SVGSVGElement>(null)
    const lastEmitted = useRef<RGB>(value)

    const [puck, setPuck] = useState<Point>(() => {
        const { h, s } = rgbToHsv(value)
        return polarToPoint(h, s)
    })
    const [isDragging, setIsDragging] = useState(false)

    // Re-sync the puck's position when the color changes from outside the wheel itself,
    // e.g. by typing into the RGB or hex fields.
    useEffect(() => {
        if (isSameColor(value, lastEmitted.current)) {
            return
        }

        lastEmitted.current = value

        const { h, s } = rgbToHsv(value)
        setPuck(polarToPoint(h, s))
    }, [value])

    const emit = useCallback((next: RGB) => {
        lastEmitted.current = next
        onChange(next)
    }, [onChange])

    const pointFromClient = useCallback((clientX: number, clientY: number): { point: Point; rgb: RGB } | null => {
        const svg = svgRef.current

        if (!svg) {
            return null
        }

        const rect = svg.getBoundingClientRect()

        if (rect.width === 0 || rect.height === 0) {
            return null
        }

        const localX = ((clientX - rect.left) / rect.width) * VIEW_SIZE - CENTER
        const localY = ((clientY - rect.top) / rect.height) * VIEW_SIZE - CENTER

        const angleRad = Math.atan2(localY, localX)
        const radius = Math.min(MAX_RADIUS, Math.hypot(localX, localY))
        const hue = normalizeDegrees((angleRad * 180) / Math.PI)
        const saturation = radius / MAX_RADIUS

        return {
            point: { x: CENTER + radius * Math.cos(angleRad), y: CENTER + radius * Math.sin(angleRad) },
            rgb: hsvToRgb({ h: hue, s: saturation, v: 1 }),
        }
    }, [])

    const handlePointerMove = useCallback((e: PointerEvent) => {
        const next = pointFromClient(e.clientX, e.clientY)

        if (!next) {
            return
        }

        setPuck(next.point)
        emit(next.rgb)
    }, [pointFromClient, emit])

    const handlePointerUp = useCallback(() => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
        setIsDragging(false)
    }, [handlePointerMove])

    // Ensure listeners never leak if the wheel unmounts mid-drag.
    useEffect(() => {
        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', handlePointerUp)
        }
    }, [handlePointerMove, handlePointerUp])

    const handlePuckPointerDown = useCallback((e: React.PointerEvent) => {
        e.preventDefault()

        setIsDragging(true)

        const next = pointFromClient(e.clientX, e.clientY)

        if (next) {
            setPuck(next.point)
            emit(next.rgb)
        }

        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('pointerup', handlePointerUp)
    }, [pointFromClient, emit, handlePointerMove, handlePointerUp])

    const handleSwatchClick = useCallback((swatch: WheelSwatch) => {
        setIsDragging(false)
        setPuck({ x: swatch.x, y: swatch.y })
        emit(swatch.rgb)
    }, [emit])

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
            className="np-w-full np-h-auto np-select-none"
            style={{ touchAction: 'none' }}
        >
            {WHEEL_SWATCHES.map((swatch, i) => (
                <circle
                    key={i}
                    cx={swatch.x}
                    cy={swatch.y}
                    r={SWATCH_RADIUS}
                    fill={`rgb(${swatch.rgb.r}, ${swatch.rgb.g}, ${swatch.rgb.b})`}
                    onClick={() => handleSwatchClick(swatch)}
                    className="hover:np-cursor-pointer"
                />
            ))}
            <g
                onPointerDown={handlePuckPointerDown}
                style={{
                    cursor: 'pointer',
                    transform: `translate(${puck.x}px, ${puck.y}px)`,
                    transition: isDragging ? 'none' : 'transform 160ms ease',
                }}
            >
                <circle r={PUCK_OUTER_WHITE_RADIUS} fill={COLORS.LIGHT} />
                <circle r={PUCK_BLACK_RADIUS} fill={COLORS.DARK} />
                <circle r={PUCK_INNER_WHITE_RADIUS} fill={COLORS.LIGHT} />
                <circle r={PUCK_FILL_RADIUS} fill={`rgb(${value.r}, ${value.g}, ${value.b})`} />
            </g>
        </svg>
    )
}
