"use client"

import { useEffect, useRef } from "react"

type HomePageCrossProps = {
  cursorPosition: [x: number, y: number]
}

export const HomePageCross = ({ cursorPosition }: HomePageCrossProps) => {

  // TL TR BR BL
  const cornerPositions = useRef<[number, number][]>([
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ])

  const cellRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = cellRef.current

    if (!el) {
      return
    }

    const { left, top, width, height } = el.getBoundingClientRect()

    cornerPositions.current = [
      [left, top],
      [left + width, top],
      [left + width, top + height],
      [left, top + height]
    ]
  }, [])

  const distance = (from: [number, number], to: [number, number]): number => {
    const [ax, ay] = from
    const [bx, by] = to

    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2))
  }

  const [
    tl,
    tr,
    br,
    bl
  ] = cornerPositions.current

  const [
    tld,
    trd,
    brd,
    bld
  ] = [
      distance(cursorPosition, tl),
      distance(cursorPosition, tr),
      distance(cursorPosition, br),
      distance(cursorPosition, bl)
    ]

  const remapDistance = (dist: number, min: number, max: number): number => {
    const limit = 350

    if (dist <= 0) return max
    if (dist >= limit) return min

    return max - (max - min) * (dist / limit)
  }

  const [
    tll,
    trl,
    brl,
    bll
  ] = [
      remapDistance(tld, 2, 6),
      remapDistance(trd, 2, 6),
      remapDistance(brd, 2, 6),
      remapDistance(bld, 2, 6)
    ]

  const [
    tls,
    trs,
    brs,
    bls
  ] = [
      remapDistance(tld, 1, 2),
      remapDistance(trd, 1, 2),
      remapDistance(brd, 1, 2),
      remapDistance(bld, 1, 2)
    ]

  return (
    <div ref={cellRef} className="w-full h-full relative">
      <div className="w-2 h-2 absolute top-0 left-0">
        <svg className="overflow-visible" width={8} height={8} viewBox="0 0 8 8">
          <line x1={0} y1={0} x2={tll} y2={0} stroke="#414141" strokeWidth={`${tls}px`} strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
          <line x1={0} y1={0} x2={0} y2={tll} stroke="#414141" strokeWidth={`${tls}px`} strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="w-2 h-2 absolute top-0 right-0">
        <svg className="overflow-visible" width={8} height={8} viewBox="0 0 8 8">
          <line x1={8} y1={0} x2={8 - trl} y2={0} stroke="#414141" strokeWidth={`${trs}px`} strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
          <line x1={8} y1={0} x2={8} y2={trl} stroke="#414141" strokeWidth={`${trs}px`} strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="w-2 h-2 absolute bottom-0 right-0">
        <svg className="overflow-visible" width={8} height={8} viewBox="0 0 8 8">
          <line x1={8} y1={8} x2={8} y2={8 - brl} stroke="#414141" strokeWidth={`${brs}px`} strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
          <line x1={8} y1={8} x2={8 - brl} y2={8} stroke="#414141" strokeWidth={`${brs}px`} strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="w-2 h-2 absolute bottom-0 left-0">
        <svg className="overflow-visible" width={8} height={8} viewBox="0 0 8 8">
          <line x1={0} y1={8} x2={bll} y2={8} stroke="#414141" strokeWidth={`${bls}px`} strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
          <line x1={0} y1={8} x2={0} y2={8 - bll} stroke="#414141" strokeWidth={`${bls}px`} strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  )
}