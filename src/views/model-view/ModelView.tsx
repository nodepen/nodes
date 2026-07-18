"use client"

import React, { useCallback, useRef, useState } from "react"
import { Layer } from "../common"
import ModelCanvas from "./ModelCanvas"
import { useDispatch, useStore } from "@/store"
import { getDomainParameter } from "@/utils/numerics/domain"
import { clamp } from "@/utils"
import { CircleButton } from "@/components/layout/CircleButton"
import { COLORS } from "@/constants"

const ModelView = () => {
    const solutionModelUrl = useStore((state) => state.solution.solutionModelUrl)

    const { apply } = useDispatch()

    const [isExpanded, setIsExpanded] = useState(false)
    const [isSceneVisible, setIsSceneVisible] = useState(true)

    const handleTransitionStart = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
        switch (e.nativeEvent.propertyName) {
            case 'height': {
                setIsSceneVisible(false)
                break
            }
        }
    }, [])

    const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
        switch (e.nativeEvent.propertyName) {
            case 'height': {
                setTimeout(() => {
                    setIsSceneVisible(true)
                }, 50);
                break
            }
        }
    }, [])


    // Ratio between 0 and 1
    const [width, setWidth] = useState(0.5)
    const isDragging = useRef(false)

    const windowContainerRef = useRef<HTMLDivElement>(null)
    const handleRef = useRef<HTMLDivElement>(null)

    const dragDomain = useRef<[min: number, max: number]>([0, 1920])

    const handleHeight = 32
    const handleContainerHeight = useRef(0)
    const handleStartY = useRef(0)
    const [handleTop, setHandleTop] = useState(0)

    const handleDragAreaPointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isExpanded) {
            return
        }

        const { pageY } = e
        const { top, height } = e.currentTarget.getBoundingClientRect()

        setHandleTop(pageY - top - (handleHeight / 2))
        handleStartY.current = pageY

        handleContainerHeight.current = height
    }, [isExpanded])

    const handleDragAreaPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        const { pageY } = e

        if (isDragging.current) {
            return
        }

        const handleEl = handleRef.current

        if (!handleEl) {
            return
        }

        const dy = pageY - handleStartY.current

        const minDy = -handleTop
        const maxDy = handleContainerHeight.current - handleTop - handleHeight

        handleEl.style.transform = `translateY(${clamp(dy, minDy, maxDy)}px)`
    }, [handleTop])

    const handleDragAreaPointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        const handleEl = handleRef.current

        if (!handleEl) {
            return
        }

        handleEl.style.transform = 'translateY(0px)'
        setHandleTop(0)
    }, [])

    const handleDragPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        isDragging.current = true

        const { left, width } = windowContainerRef.current?.getBoundingClientRect() ?? { left: 0, width: 1920 }
        dragDomain.current = [left, left + width]

        e.currentTarget.setPointerCapture(e.pointerId)
    }, [])

    const handleDragPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) {
            return
        }

        const { pageX } = e

        const t = getDomainParameter(dragDomain.current, pageX)
        setWidth(clamp(1 - t, 0.25, 1))
    }, [])

    const handleDragPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        isDragging.current = false
    }, [])

    const gutterLeft = 72

    const containerWidth = dragDomain.current[1] - dragDomain.current[0]
    const modelWindowWidth = isExpanded ? containerWidth * width : 0

    const controlsMarginLeft = clamp((containerWidth - modelWindowWidth - gutterLeft) * -1, 0, gutterLeft)

    const gridButtonTooltip = useStore((state) => state.geometry.showGrid ? 'Hide Grid' : 'Show Grid')
    const toggleGrid = useCallback(() => {
        apply((state) => {
            state.geometry.showGrid = !state.geometry.showGrid
        })
    }, [])

    return (
        <Layer id="np-model-layer" z={85}>
            <div className="np-w-full np-h-full np-p-4 np-flex np-flex-col np-justify-end np-pointer-events-none">
                <div ref={windowContainerRef} className={`${isExpanded ? 'np-h-full' : 'np-h-20'} np-ease-out np-w-full np-relative np-transition-all np-duration-[350ms] `} onTransitionStart={handleTransitionStart} onTransitionEnd={handleTransitionEnd}>
                    <div className={`${isExpanded ? 'np-rounded-[34px]' : 'np-rounded-lg'} np-ease-out np-h-full np-bg-pale np-p-0.5 np-absolute np-transition-all np-duration-[350ms] np-pointer-events-auto np-group/container`} style={{ width: isExpanded ? `${width * 100}%` : '102px', bottom: isExpanded ? "0px" : "8px", right: isExpanded ? "0" : "calc(50% - 51px)" }}>
                        <div className={`${isExpanded ? 'np-rounded-[32px]' : 'np-rounded-lg'} np-w-full np-h-full np-p-0.5 np-border-2 np-border-green np-transition-all np-duration-[350ms]`}>
                            <div className={`${isExpanded ? 'np-rounded-[30px]' : 'np-rounded-md'} np-w-full np-h-full np-relative`}>
                                <div className={`${isExpanded ? 'np-rounded-[28px]' : 'np-rounded-[4px]'} ${isSceneVisible ? 'np-opacity-100' : 'np-opacity-0'} np-w-full np-h-full np-absolute np-flex np-items-center np-justify-center np-z-20 np-bg-pale np-overflow-hidden`} onPointerDownCapture={(e) => {
                                    if (isExpanded) {
                                        return
                                    }

                                    e.stopPropagation()
                                }}>
                                    <ModelCanvas solutionModelUrl={solutionModelUrl} />
                                </div>
                                <div className="np-w-full np-h-full np-absolute np-flex np-flex-col np-items-start np-justify-end np-invisible group-hover/container:np-visible np-z-30 np-pointer-events-none">
                                    <div className={`${isExpanded ? 'np-w-full np-pl-6 np-pb-6' : 'np-w-16 np-pl-[29px] np-pb-4'} np-flex np-items-center np-justify-start np-overflow-hidden np-whitespace-nowrap np-transition-all np-duration-[350ms] np-ease-out -np-translate-y-0.5`} style={{ marginLeft: `${controlsMarginLeft}px` }}>
                                        <div className="np-flex np-items-center np-gap-1">
                                            <CircleButton shadow tooltip={isExpanded ? 'Hide 3D Model' : 'Show 3D Model'} onClick={() => setIsExpanded((value) => !value)}>
                                                {isExpanded ? (
                                                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-4">
                                                        <path d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                                    </svg>
                                                ) : (
                                                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-4">
                                                        <path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                                    </svg>
                                                )}
                                            </CircleButton>
                                            {isExpanded ? (<>
                                                <CircleButton shadow onClick={toggleGrid} tooltip={gridButtonTooltip}>
                                                    <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="np-size-5">
                                                        <path d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                                        <line x1={5} y1={12} x2={19} y2={12} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                                        <line x1={12} y1={5} x2={12} y2={19} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                                                    </svg>
                                                </CircleButton>
                                            </>) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="np-w-full np-h-full np-absolute np-flex np-justify-start np-items-center np-z-50 np-pointer-events-none">
                                    <div className={`${isExpanded ? 'np-pointer-events-auto' : 'np-pointer-events-none'} np-w-8 np-h-[85%] np-relative np-group/resize`} style={{ transform: 'translateX(-19px)' }} onPointerEnter={handleDragAreaPointerEnter} onPointerMove={handleDragAreaPointerMove} onPointerLeave={handleDragAreaPointerLeave} onPointerCancel={handleDragAreaPointerLeave}>
                                        <div className="np-w-8 np-h-8 np-absolute np-flex np-justify-center np-items-center np-invisible hover:np-cursor-ew-resize group-hover/resize:np-visible" style={{ top: `${handleTop}px` }}>
                                            <div ref={handleRef} className="np-w-[11px] np-border-2 np-border-pale np-rounded-sm np-bg-green hover:np-cursor-ew-resize np-transition-transform np-duration-250" style={{ height: `${handleHeight}px`, transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)', willChange: 'transform' }} onPointerDown={handleDragPointerDown} onPointerMove={handleDragPointerMove} onPointerUp={handleDragPointerUp} onPointerCancel={handleDragPointerUp} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layer >
    )
}

export default React.memo(ModelView)