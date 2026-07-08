import { COLORS, DIMENSIONS } from '@/constants'
import { useLerpState } from '@/hooks/useLerpState'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from '$'
import { useDocumentRef, useImperativeEvent } from '@/hooks'
import { CircleButton } from '@/components/layout/CircleButton'
import { getDomainParameter } from '@/utils/numerics/domain'
import { clamp } from '@/utils'

const {
    NUMBER_SLIDER_HANDLE_WIDTH,
    NUMBER_SLIDER_HANDLE_HEIGHT
} = DIMENSIONS

const DocumentViewToggle = () => {
    const { apply } = useDispatch()

    const documentRef = useDocumentRef()

    const dialRef = useRef<SVGSVGElement | null>(null)

    const containerRef = useRef<SVGRectElement | null>(null)
    const handleRef = useRef<SVGRectElement | null>(null)

    // 0 = left, 1 = right
    const [viewParameter, setViewParameter] = useLerpState(0, 0.15)

    useEffect(() => {
        apply((state) => {
            state.layout.viewConfiguration = {
                0: 1 - viewParameter,
                1: viewParameter
            }
        })
    }, [viewParameter])

    const pageDimensions = useRef({
        startX: 0,
        endX: 0,
        // The center of the handle when motion started
        initialX: 0,
        // The literal cursor position when motion started
        // Note: Otherwise, first move might snap handle to cursor position
        initialCursorX: 0
    })

    const [isDragging, setIsDragging] = useState(false)

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGRectElement>) => {
        const { pointerId, pageX } = e

        const containerEl = containerRef.current
        const handleEl = handleRef.current

        if (!containerEl || !handleEl) {
            return
        }

        e.preventDefault()
        e.currentTarget.setPointerCapture(pointerId)

        const getCenter = (el: SVGRectElement): [px: number, py: number] => {
            const { left, top, width, height } = el.getBoundingClientRect()
            return [left + (width / 2), top + (height / 2)]
        }

        const { left, top, width, height } = containerEl.getBoundingClientRect()
        const [hx, hy] = getCenter(handleEl)

        const startX = left
        const endX = left + width
        const initialX = hx

        pageDimensions.current = {
            startX,
            endX,
            initialX,
            initialCursorX: pageX
        }

        document.body.style.cursor = 'grabbing'

        setIsDragging(true)
    }, [])

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!isDragging) {
            return
        }

        const { pageX: cursorX, pageY: cursorY } = e
        const { startX, endX, initialX, initialCursorX } = pageDimensions.current

        const dx = cursorX - initialCursorX
        const nextValue = initialX + dx

        const t = clamp(1 - getDomainParameter([startX, endX], nextValue), 0, 1)

        setViewParameter(t, { immediate: true })
    }, [isDragging, viewParameter])

    const handlePointerUp = useCallback((e: PointerEvent) => {
        if (!isDragging) {
            return
        }

        const breakpoints = [0, 0.25, 0.5, 0.75, 1]
        const closest = breakpoints.reduce((prev, curr) => Math.abs(viewParameter - curr) < Math.abs(viewParameter - prev) ? curr : prev)
        setViewParameter(closest)
        setIsDragging(false)
        document?.getSelection?.()?.removeAllRanges()
        document.body.style.cursor = 'auto'
    }, [isDragging, viewParameter])

    useImperativeEvent(documentRef, 'pointermove', handlePointerMove)
    useImperativeEvent(documentRef, 'pointerup', handlePointerUp)

    const delta = 0.5 * viewParameter
    const leftScale = 1 + (0.25 - delta)
    const rightScale = 1 - (0.25 - delta)

    const dx = 20 * (1 - viewParameter)

    // return (
    //     <div className='np-h-full np-flex np-items-center np-justify-between np-border-2 np-border-dark np-rounded-md np-pointer-events-auto'>
    //         <button className='np-w-12 np-h-12 np-ml-1 np-mr-3 np-flex np-items-center np-justify-center np-rounded-sm hover:np-cursor-pointer np-group np-overflow-visible' onClick={() => setViewParameter(0)}>
    //             <div style={{ width: `calc(2rem * ${leftScale})`, height: `calc(2rem * ${leftScale})` }} className={`${isDragging ? '' : 'group-hover:np-bg-grey-2'} np-flex np-items-center np-border-2 np-border-dark np-justify-center np-bg-light np-rounded-full`}>
    //                 <svg width={18 * leftScale} height={18 * leftScale} fill="none" strokeWidth="2" stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    //                     <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" vectorEffect="non-scaling-stroke"></path>
    //                 </svg>
    //             </div>
    //         </button>
    //         <svg width="80" height="40" className='np-overflow-visible hover:np-cursor-grab np-group' viewBox="0 0 20 10" ref={dialRef} onPointerDown={handlePointerDown}>
    //             <path d="M 0 10 A 10 10 0 0 1 20 10" fill="none" stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinecap="square" />
    //             <IncrementMarkers />
    //             <g style={{ transform: `rotate(${dialRotation}deg)`, transformOrigin: '50% 100%' }}>
    //                 <path d="M 11 10 A 1 1 0 0 1 9 10 L 9.5 0 A 0.5 0.5 0 0 1 10.5 0 Z" className='np-fill-light group-hover:np-fill-grey-2' stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
    //             </g>
    //         </svg>
    //         <button className='np-w-12 np-h-12 np-ml-3 np-mr-1 np-flex np-items-center np-justify-center np-rounded-sm hover:np-cursor-pointer np-group np-overflow-visible' onClick={() => setViewParameter(1)}>
    //             <div style={{ width: `calc(2rem * ${rightScale})`, height: `calc(2rem * ${rightScale})` }} className={`${isDragging ? '' : 'group-hover:np-bg-grey-2'} np-flex np-items-center np-border-2 np-border-dark np-justify-center np-bg-light np-rounded-full`}>
    //                 <svg width={18 * rightScale} height={18 * rightScale} fill="none" strokeWidth="2" stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    //                     <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" vectorEffect="non-scaling-stroke" />
    //                 </svg>
    //             </div>
    //         </button>
    //     </div>
    // )

    const w = NUMBER_SLIDER_HANDLE_WIDTH / 5
    const h = NUMBER_SLIDER_HANDLE_HEIGHT / 5

    const LARGE_HEIGHT = 1
    const SMALL_HEIGHT = 0.5

    return <div className='np-h-full np-p-0.5 np-flex np-items-center np-justify-between np-border-2 np-border-dark np-rounded-md np-pointer-events-auto'>
        <div className='np-h-full np-w-12 np-flex np-items-center np-justify-center'>
            <CircleButton onClick={() => setViewParameter(0)}>
                <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-5'>
                    <path d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
            </CircleButton>
        </div>
        <div className='np-h-full np-pt-0.5 np-pb-0.5 np-ml-1 np-mr-1 np-flex np-items-center np-justify-center'>
            <div className='np-h-full np-w-auto np-aspect-[2/1] np-pointer-events-auto'>
                <svg viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg" className='np-w-full np-h-full np-overflow-visible np-pointer-events-auto'>
                    {/* Outline */}
                    <rect ref={containerRef} x={0} y={0} width={20} height={10} rx={0.5} ry={0.5} fill="none" stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    {/* Primary guides */}
                    <line x1={0} y1={5 - LARGE_HEIGHT} x2={20} y2={5 - LARGE_HEIGHT} stroke={COLORS.LIGHT} strokeWidth={4} strokeLinecap="square" vectorEffect="non-scaling-stroke" />
                    <line x1={0} y1={5 + LARGE_HEIGHT} x2={20} y2={5 + LARGE_HEIGHT} stroke={COLORS.LIGHT} strokeWidth={4} strokeLinecap="square" vectorEffect="non-scaling-stroke" />
                    <line x1={0} y1={5 - LARGE_HEIGHT} x2={0} y2={5 + LARGE_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={5} y1={5 - LARGE_HEIGHT} x2={5} y2={5 + LARGE_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={10} y1={5 - LARGE_HEIGHT} x2={10} y2={5 + LARGE_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={15} y1={5 - LARGE_HEIGHT} x2={15} y2={5 + LARGE_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={20} y1={5 - LARGE_HEIGHT} x2={20} y2={5 + LARGE_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    {/* Secondary guides */}
                    <line x1={0 + 1.667} y1={5 - SMALL_HEIGHT} x2={0 + 1.667} y2={5 + SMALL_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={0 + 3.333} y1={5 - SMALL_HEIGHT} x2={0 + 3.333} y2={5 + SMALL_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={5 + 1.667} y1={5 - SMALL_HEIGHT} x2={5 + 1.667} y2={5 + SMALL_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={5 + 3.333} y1={5 - SMALL_HEIGHT} x2={5 + 3.333} y2={5 + SMALL_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={10 + 1.667} y1={5 - SMALL_HEIGHT} x2={10 + 1.667} y2={5 + SMALL_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={10 + 3.333} y1={5 - SMALL_HEIGHT} x2={10 + 3.333} y2={5 + SMALL_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={15 + 1.667} y1={5 - SMALL_HEIGHT} x2={15 + 1.667} y2={5 + SMALL_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <line x1={15 + 3.333} y1={5 - SMALL_HEIGHT} x2={15 + 3.333} y2={5 + SMALL_HEIGHT} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    {/* Handle */}
                    <line x1={dx} y1={-0.5} x2={dx} y2={10.5} stroke={COLORS.LIGHT} strokeWidth={6} vectorEffect="non-scaling-stroke" />
                    <line x1={dx} y1={0} x2={dx} y2={10} stroke={COLORS.DARK} strokeWidth={2} strokeLinecap='square' vectorEffect="non-scaling-stroke" />
                    <rect ref={handleRef} x={dx - w / 2} y={5 - h / 2} width={w} height={h} rx={0.25} ry={0.25} stroke={COLORS.DARK} strokeWidth={2} fill={COLORS.LIGHT} vectorEffect="non-scaling-stroke" className='np-pointer-events-auto hover:np-cursor-pointer' onPointerDown={handlePointerDown} />
                </svg>
            </div>
        </div>
        <div className='np-h-full np-w-12 np-flex np-items-center np-justify-center'>
            <CircleButton onClick={() => setViewParameter(1)}>
                <svg aria-hidden="true" fill="none" strokeWidth={2} stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='np-size-4'>
                    <path d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
            </CircleButton>
        </div>
    </div>
}

const IncrementMarkers = () => {
    const MAJOR_LENGTH = 1.75
    const MINOR_LENGTH = 0.75
    return (
        <>
            {/* Major */}
            <Ray from={[10, 10]} position={180} raySize={9} segmentSize={MAJOR_LENGTH} />
            <Ray from={[10, 10]} position={135} raySize={9} segmentSize={MAJOR_LENGTH} />
            <Ray from={[10, 10]} position={90} raySize={9} segmentSize={MAJOR_LENGTH} />
            <Ray from={[10, 10]} position={45} raySize={9} segmentSize={MAJOR_LENGTH} />
            <Ray from={[10, 10]} position={0} raySize={9} segmentSize={MAJOR_LENGTH} />
            {/* Minor */}
            <Ray from={[10, 10]} position={15} raySize={9} segmentSize={MINOR_LENGTH} />
            <Ray from={[10, 10]} position={30} raySize={9} segmentSize={MINOR_LENGTH} />
            <Ray from={[10, 10]} position={60} raySize={9} segmentSize={MINOR_LENGTH} />
            <Ray from={[10, 10]} position={75} raySize={9} segmentSize={MINOR_LENGTH} />
            <Ray from={[10, 10]} position={105} raySize={9} segmentSize={MINOR_LENGTH} />
            <Ray from={[10, 10]} position={120} raySize={9} segmentSize={MINOR_LENGTH} />
            <Ray from={[10, 10]} position={150} raySize={9} segmentSize={MINOR_LENGTH} />
            <Ray from={[10, 10]} position={165} raySize={9} segmentSize={MINOR_LENGTH} />
        </>
    )
}

type RayProps = {
    // Ray center point
    from: [cx: number, cy: number]
    // In degrees
    position: number
    // Length of ray from center
    raySize: number
    // Length of line drawn along ray
    segmentSize: number
}

const Ray = ({ from, position, raySize, segmentSize }: RayProps) => {
    const [cx, cy] = from
    const rad = position / (180 / Math.PI)

    const unitX = Math.cos(rad)
    const unitY = Math.sin(rad) * -1

    const segmentRadius = raySize - segmentSize

    return <line x1={unitX * segmentRadius + cx} y1={unitY * segmentRadius + cy} x2={unitX * raySize + cx} y2={unitY * raySize + cy} stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
}

export default React.memo(DocumentViewToggle)