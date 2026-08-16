import React, { useCallback, useEffect, useRef, useState } from 'react'
import type * as NodePen from '@/types'
import { COLORS } from '@/constants'
import { useDispatch, useStore } from '@/store'
import { tryGetSingleValue, createSingleValue } from '@/utils/data-trees'
import { getDomainParameter } from '@/utils/numerics/domain'
import { clamp } from '@/utils'
import { expireSolution } from '@/store/utils'

type DocumentControlsNumberSliderProps = {
    nodeInstanceId: string
    portInstanceId: string
    config: NodePen.NumberSliderConfig
    isDisabled?: boolean
}

export const DocumentControlsNumberSlider = ({ nodeInstanceId, portInstanceId, config, isDisabled }: DocumentControlsNumberSliderProps) => {
    const { min, max, precision } = config

    const { apply } = useDispatch()

    const currentValue = useStore((state) => {
        const raw = tryGetSingleValue(state.document.nodes[nodeInstanceId]?.values[portInstanceId])?.value
        return Number.parseFloat(raw ?? '0')
    })

    const trackRef = useRef<HTMLDivElement>(null)
    const activePointerId = useRef<number>(-1)
    const [isActive, setIsActive] = useState(false)
    const initialSliderValue = useRef(currentValue)
    const initialPointerPageX = useRef(0)

    const commitNumericValue = useCallback((nextValue: number) => {
        apply((state) => {
            state.document.nodes[nodeInstanceId].values[portInstanceId] = createSingleValue(nextValue.toFixed(precision), 'number')
            expireSolution(state)
        })
    }, [apply, nodeInstanceId, portInstanceId, precision])

    const [internalValueText, setInternalValueText] = useState(currentValue.toFixed(precision))
    useEffect(() => {
        setInternalValueText(currentValue.toFixed(precision))
    }, [currentValue, precision])

    const handleValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValueText(e.currentTarget.value)
    }, [])

    const handleValueKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()

        if (e.key.toLowerCase() === 'enter') {
            e.currentTarget.blur()
        }
    }, [])

    const handleValueFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select()
    }, [])

    const handleValueBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const parsed = Number.parseFloat(e.currentTarget.value)

        if (Number.isNaN(parsed)) {
            // Invalid, snap back to the last known-good value.
            setInternalValueText(currentValue.toFixed(precision))
            return
        }

        commitNumericValue(clamp(parsed, min, max))
    }, [currentValue, precision, min, max, commitNumericValue])

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isActive) {
            return
        }

        e.stopPropagation()
        e.currentTarget.setPointerCapture(e.pointerId)

        setIsActive(true)
        activePointerId.current = e.pointerId
        initialSliderValue.current = currentValue
        initialPointerPageX.current = e.pageX
    }, [isActive, currentValue])

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isActive || e.pointerId !== activePointerId.current) {
            return
        }

        const track = trackRef.current

        if (!track) {
            return
        }

        const { width } = track.getBoundingClientRect()

        if (width <= 0) {
            return
        }

        const pixelToValue = (max - min) / width
        const pixelDelta = e.pageX - initialPointerPageX.current
        const valueDelta = pixelToValue * pixelDelta

        const p = Math.pow(10, precision)
        const nextValue = clamp(Math.round((initialSliderValue.current + valueDelta) * p) / p, min, max)

        apply((state) => {
            state.document.nodes[nodeInstanceId].values[portInstanceId] = createSingleValue(nextValue.toFixed(precision), 'number')
        })
    }, [isActive, max, min, precision, apply, nodeInstanceId, portInstanceId])

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isActive || e.pointerId !== activePointerId.current) {
            return
        }

        setIsActive(false)

        if (currentValue !== initialSliderValue.current) {
            apply((state) => {
                expireSolution(state)
            })
        }
    }, [isActive, currentValue, apply])

    const t = clamp(getDomainParameter([min, max], currentValue), 0, 1)
    const valueOnLeft = t > 0.5

    if (isDisabled) {
        return (
            <div className="np-w-full np-pl-1 np-flex np-items-center">
                <p className="np-text-xs np-text-grey-3 np-font-panel np-select-none">
                    {currentValue.toFixed(precision)}
                </p>
            </div>
        )
    }

    return (
        <div className="np-w-full np-flex np-items-center np-gap-1">
            <input
                className="np-w-12 np-flex-shrink-0 np-h-5 np-pt-1 np-pl-1 np-mr-1 np-rounded-sm hover:np-bg-grey np-text-xs np-text-dark np-font-panel focus:np-outline-none"
                value={internalValueText}
                onChange={handleValueChange}
                onKeyDown={handleValueKeyDown}
                onFocus={handleValueFocus}
                onBlur={handleValueBlur}
            />
            {/* <p className="np-text-[10px] np-text-dark np-font-panel np-select-none">
                {min.toFixed(precision)}
            </p> */}
            <div ref={trackRef} className="np-relative np-flex-grow np-h-5 np-flex np-items-center">
                <div className="np-absolute np-left-0 np-right-0 np-top-1/2 np-h-[2px] -np-translate-y-1/2" style={{ background: COLORS.DARK }} />
                {/* <p
                    className="np-absolute np-top-1/2 -np-translate-y-1/2 np-text-[10px] np-text-dark np-font-panel np-whitespace-nowrap np-select-none np-pointer-events-none"
                    style={{
                        left: `${t * 100}%`,
                        transform: `translate(${valueOnLeft ? 'calc(-100% - 8px)' : '8px'}, -50%)`
                    }}
                >
                    {currentValue.toFixed(precision)}
                </p> */}
                <div
                    className="np-absolute np-top-1/2 np-w-2 np-h-4 np-rounded-sm hover:np-cursor-pointer"
                    style={{
                        left: `${t * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        background: COLORS.LIGHT,
                        border: `2px solid ${COLORS.DARK}`
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                />
            </div>
            <div id="spacer" className='np-w-3' />
            {/* <p className="np-text-[10px] np-text-dark np-font-panel np-select-none">
                {max.toFixed(precision)}
            </p> */}
        </div>
    )
}
