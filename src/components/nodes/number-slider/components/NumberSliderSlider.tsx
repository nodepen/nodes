import React, { useCallback, useEffect, useRef, useState } from 'react'
import type * as NodePen from '@/types'
import { useDispatch, useStore } from '$'
import { COLORS, DIMENSIONS } from '@/constants'
import { tryGetSingleValue } from '@/utils/data-trees'
import { getDomainParameter } from '@/utils/numerics/domain'
import { createSingleValue } from '@/utils/data-trees/createSingleValue'
import { expireSolution } from '@/store/utils'
import { clamp } from '@/utils'

type NumberSliderSliderProps = {
    node: NodePen.DocumentNode
    config: NodePen.NumberSliderConfig
}

const {
    NODE_INTERNAL_PADDING,
    NUMBER_SLIDER_HANDLE_HEIGHT,
    NUMBER_SLIDER_HANDLE_WIDTH,
    NUMBER_SLIDER_VALUE_WIDTH,
} = DIMENSIONS

// ComponentBuilderBuilder
export const NumberSliderSlider = ({ node, config }: NumberSliderSliderProps) => {
    const { x, y } = node.position
    const { width, height } = node.dimensions
    const { min, max, precision } = config

    const handleRef = useRef<SVGRectElement | null>(null)
    const handleRailRef = useRef<SVGLineElement | null>(null)

    const { apply } = useDispatch()

    const padding = NODE_INTERNAL_PADDING * 2
    const start = x + padding + NUMBER_SLIDER_VALUE_WIDTH + NODE_INTERNAL_PADDING
    const end = x + width - padding

    const currentValue = Number.parseFloat(tryGetSingleValue(node.values['output'])?.value ?? '0')

    const t = getDomainParameter([config.min, config.max], currentValue)
    const dx = t * (end - start)
    const dy = height / 2

    const activePointerId = useRef<number>(-1)
    const [isActive, setIsActive] = useState(false)

    const initialSliderValue = useRef<number>(currentValue)
    const initialPointerPageX = useRef<number>(0)
    const [sliderPageXDomain, setSliderPageXDomain] = useState<[minX: number, maxX: number]>([0, 0])

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGRectElement>) => {
        if (isActive) {
            return
        }

        e.stopPropagation()

        const { pageX, pageY, pointerId } = e

        const handleElement = handleRef.current
        const handleRailElement = handleRailRef.current

        if (!handleElement || !handleRailElement) {
            console.log('🐍 Could not find number slider geometry!')
            return
        }

        handleElement.setPointerCapture(pointerId)

        const { left, width } = handleRailElement.getBoundingClientRect()
        setSliderPageXDomain([left, left + width])

        const currentValue = tryGetSingleValue(node.values['output'])?.value

        if (!currentValue) {
            console.log('🐍 Number slider has no value!')
            return
        }

        const currentNumericValue = Number.parseFloat(currentValue)

        setIsActive(true)
        activePointerId.current = pointerId
        initialSliderValue.current = currentNumericValue
        initialPointerPageX.current = pageX
    }, [isActive, currentValue, dy, dy, start, x])

    const handlePointerMove = useCallback((e: React.PointerEvent<SVGRectElement>) => {
        if (!isActive || e.pointerId !== activePointerId.current) {
            return
        }

        const pixelToValue = (max - min) / (sliderPageXDomain[1] - sliderPageXDomain[0])

        const { pageX } = e

        const pixelDelta = pageX - initialPointerPageX.current
        const valueDelta = pixelToValue * pixelDelta

        const p = Math.pow(10, precision)
        const nextValue = clamp(Math.round((initialSliderValue.current + valueDelta) * p) / p, min, max)

        apply((state) => {
            state.document.nodes[node.instanceId].values['output'] = createSingleValue(nextValue.toFixed(precision), 'number')
        })
    }, [isActive, sliderPageXDomain, max, min, dx, dy, x])

    const handlePointerUp = useCallback((e: React.PointerEvent<SVGRectElement>) => {
        if (!isActive || e.pointerId !== activePointerId.current) {
            return
        }

        setIsActive(false)

        // Commit value
        apply((state) => {
            state.document.nodes[node.instanceId].anchors['handle'] = {
                dx: start + dx + NUMBER_SLIDER_HANDLE_WIDTH / 2,
                dy: y + dy - NUMBER_SLIDER_HANDLE_HEIGHT / 2
            }
            if (currentValue !== initialSliderValue.current) {
                expireSolution(state)
            }
        })
    }, [isActive, currentValue])

    return (
        <g>
            <line ref={handleRailRef} x1={start} y1={y + height / 2} x2={end} y2={y + height / 2} stroke={COLORS.DARK} strokeWidth={2} />
            <rect ref={handleRef} className='np-pointer-events-all hover:np-cursor-pointer' x={start + dx - NUMBER_SLIDER_HANDLE_WIDTH / 2} y={y + dy - NUMBER_SLIDER_HANDLE_HEIGHT / 2} width={NUMBER_SLIDER_HANDLE_WIDTH} height={NUMBER_SLIDER_HANDLE_HEIGHT} rx={2} ry={2} fill={COLORS.LIGHT} stroke={COLORS.DARK} strokeWidth={2} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
        </g>
    )
}