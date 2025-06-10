import { COLORS } from '@/constants'
import { useLerpState } from '@/hooks/useLerpState'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from '$'
import { useDocumentRef, useImperativeEvent } from '@/hooks'

const DocumentViewToggle = () => {
  const { apply } = useDispatch()

  const documentRef = useDocumentRef()
  const dialRef = useRef<SVGSVGElement | null>(null)

  // 0 = left, 1 = rightt
  const [viewParameter, setViewParameter] = useLerpState(0, 0.15)

  useEffect(() => {
    apply((state) => {
      state.layout.viewConfiguration = {
        0: 1 - viewParameter,
        1: viewParameter
      }
    })
  }, [viewParameter])

  const dialRotation = 180 * viewParameter - 90

  const dialAnchor = useRef<[pageX: number, pageY: number]>([0, 0])
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svgElement = dialRef.current
    if (!svgElement) {
      return
    }

    e.preventDefault()

    const { left, top, width, height } = svgElement.getBoundingClientRect()

    document.body.style.cursor = 'grabbing'
    dialAnchor.current = [
      left + width / 2,
      top + height
    ]
    setIsDragging(true)
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging) {
      return
    }

    const { pageX: cursorX, pageY: cursorY } = e
    const [centerX, centerY] = dialAnchor.current

    const vectorX = cursorX - centerX
    const vectorY = centerY - cursorY // Inverted

    const angleRad = Math.atan2(vectorY, vectorX)
    const angleDeg = angleRad * 180 / Math.PI

    if (angleDeg < 0) {
      setViewParameter(viewParameter < 0.5 ? 0 : 1, { immediate: true })
      return
    }

    const factor = 1 - (angleDeg / 180)

    setViewParameter(factor, { immediate: true })
  }, [isDragging, viewParameter])

  const handlePointerUp = useCallback((e: PointerEvent) => {
    const breakpoints = [0, 0.25, 0.5, 0.75, 1]
    const closest = breakpoints.reduce((prev, curr) => Math.abs(viewParameter - curr) < Math.abs(viewParameter - prev) ? curr : prev)
    setViewParameter(closest)
    setIsDragging(false)
    document?.getSelection?.()?.removeAllRanges()
    document.body.style.cursor = 'auto'
  }, [viewParameter])

  useImperativeEvent(documentRef, 'pointermove', handlePointerMove)
  useImperativeEvent(documentRef, 'pointerup', handlePointerUp)

  const delta = 0.5 * viewParameter
  const leftScale = 1 + (0.25 - delta)
  const rightScale = 1 - (0.25 - delta)

  return (
    <div className='np-h-full np-flex np-items-center np-justify-between np-border-2 np-border-dark np-rounded-md np-pointer-events-auto'>
      <button className='np-w-12 np-h-12 np-ml-1 np-mr-3 np-flex np-items-center np-justify-center np-rounded-sm hover:np-cursor-pointer np-group np-overflow-visible' onClick={() => setViewParameter(0)}>
        <div style={{ width: `calc(2rem * ${leftScale})`, height: `calc(2rem * ${leftScale})` }} className={`${isDragging ? '' : 'group-hover:np-bg-grey-2'} np-flex np-items-center np-border-2 np-border-dark np-justify-center np-bg-light np-rounded-full`}>
          <svg width={18 * leftScale} height={18 * leftScale} fill="none" strokeWidth="2" stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" vectorEffect="non-scaling-stroke"></path>
          </svg>
        </div>
      </button>
      <svg width="80" height="40" className='np-overflow-visible hover:np-cursor-grab np-group' viewBox="0 0 20 10" ref={dialRef} onPointerDown={handlePointerDown}>
        <path d="M 0 10 A 10 10 0 0 1 20 10" fill="none" stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinecap="square" />
        <IncrementMarkers />
        <g style={{ transform: `rotate(${dialRotation}deg)`, transformOrigin: '50% 100%' }}>
          <path d="M 11 10 A 1 1 0 0 1 9 10 L 9.5 0 A 0.5 0.5 0 0 1 10.5 0 Z" className='np-fill-light group-hover:np-fill-grey-2' stroke={COLORS.DARK} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      <button className='np-w-12 np-h-12 np-ml-3 np-mr-1 np-flex np-items-center np-justify-center np-rounded-sm hover:np-cursor-pointer np-group np-overflow-visible' onClick={() => setViewParameter(1)}>
        <div style={{ width: `calc(2rem * ${rightScale})`, height: `calc(2rem * ${rightScale})` }} className={`${isDragging ? '' : 'group-hover:np-bg-grey-2'} np-flex np-items-center np-border-2 np-border-dark np-justify-center np-bg-light np-rounded-full`}>
          <svg width={18 * rightScale} height={18 * rightScale} fill="none" strokeWidth="2" stroke={COLORS.DARK} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </button>
    </div>
  )
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