import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  const [[w, h], setCircleDimensions] = useState<[number, number]>([0, 0])
  const [offset, setOffset] = useState(0)

  const [isHovered, setIsHovered] = useState(false)

  const circleRef = useRef<HTMLDivElement>(null)

  const grid = useMemo(() => {
    const spacing = 0.25
    const stepCount = Math.round(10 / spacing)

    const svg: React.ReactNode[] = []

    for (let i = 0; i < stepCount; i++) {
      const pos = i * spacing
      svg.push(
        <line
          key={`grid-v-${i}`}
          x1={pos}
          y1="0"
          x2={pos}
          y2="10"
          stroke="#98E2C6"
          strokeWidth="1px"
          vectorEffect="non-scaling-stroke"
        />
      )
      svg.push(
        <line
          key={`grid-h-${i}`}
          x1="0"
          y1={pos}
          x2="10"
          y2={pos}
          stroke="#98E2C6"
          strokeWidth="1px"
          vectorEffect="non-scaling-stroke"
        />
      )
    }

    return svg
  }, [])

  const circleStyle: React.CSSProperties = {
    transform: `translate(-${w * 0.5}px, -${h * 0.5}px)`,
  }

  useEffect(() => {
    if (!circleRef.current) {
      return
    }

    const { clientWidth, clientHeight } = circleRef.current
    setCircleDimensions([clientWidth, clientHeight])
  }, [])

  useEffect(() => {
    const speed = 0.25 / 45
    const march = setInterval(
      () => {
        setOffset((offset + speed) % 0.25)
      },
      isHovered ? 15 : 40
    )
    return () => clearInterval(march)
  }, [offset, isHovered])

  const [[dx, dy], setMaskOffset] = useState<[number, number]>([0, 48 + 30])

  const handlePointerDown = useCallback((e: PointerEvent): void => {
    e.preventDefault()
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent): void => {
    const { pageX, pageY } = e

    const [w, h] = [window.innerWidth, window.innerHeight]
    const [cx, cy] = [w / 2, h / 2]

    const [x, y] = [pageX - cx, pageY - cy]

    const wt = Math.abs(x) / cx
    const ht = Math.abs(y) / cy

    const min = 1
    const max = 5
    const r = max - min

    const ox = min + r * wt
    const oy = min + r * ht

    const tx = x / ox
    const ty = y / oy

    setMaskOffset([tx, ty])
  }, [])

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  })

  const [mobileMargin, setMobileMargin] = useState(0)

  useEffect(() => {
    if (window.innerWidth > 1024) {
      return
    }

    const m = (window.innerWidth - 304) / 2
    setMobileMargin(m)
  }, [])

  const ds = 0
  const s = mobileMargin > 0 ? 304 + ds : 512 + ds

  return (
    <div
      className="w-vw h-vh bg-green flex flex-col justify-start items-center lg:flex-row lg:justify-evenly"
      style={{ touchAction: 'none' }}
    >
      <Head>
        <title>NodePen</title>
        <meta
          name="description"
          content="NodePen is a web client for Grasshopper, the visual programming language for Rhino 3D. Same Grasshopper, new digs. Powered by Rhino
          Compute."
        />
        <meta name="keywords" content="grasshopper, grasshopper online, grasshopper 3d" />
        <meta name="theme-color" content="#98E2C6" />
      </Head>
      <div className="w-76 hidden lg:flex lg:flex-col lg:items-center" />
      <div
        ref={circleRef}
        className={`rounded-full bg-pale overflow-hidden flex flex-col justify-center items-center`}
        style={{
          transform: `translate(${dx * 0.05}px, ${dy * 0.05}px)`,
          marginTop: mobileMargin,
          width: s,
          height: s,
          transitionProperty: 'width, height',
          transitionDuration: '150ms',
          transitionDelay: '150ms',
          transitionTimingFunction: 'ease-out',
        }}
      >
        <div style={circleStyle}>
          <svg
            width={`${w * 1.5}px`}
            height={`${h * 1.5}px`}
            viewBox={`${-offset + 1} ${offset + 1} 8 8`}
            style={{ position: 'absolute' }}
          >
            {grid}
          </svg>
        </div>
        <div
          className={`bg-pale rounded-full w-full h-full p-2 pt-16 flex flex-col justify-center items-center z-50`}
          style={{ transform: `translate(${dx}px, ${dy}px)` }}
        >
          <img
            className={`h-16 mt-2 mb-1`}
            src="/nodepen-brand.svg"
            alt="The NodePen logo."
            title="NodePen: Same Grasshopper, New Digs"
            style={{ transform: `translate(${dx * -0.9}px, ${dy * -0.9}px)` }}
          />
          <a
            href="/gh"
            className="w-8 h-8 mt-8 relative overflow-visible"
            style={{ transform: `translate(${dx * -0.95}px, ${dy * -0.95}px)` }}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
          >
            <svg
              className="absolute w-8 h-8 left-0 top-0 z-10 transition-colors duration-150"
              fill={isHovered ? '#093824' : '#333'}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            <div className="absolute w-12 h-12 z-0 rounded-md overflow-hidden" style={{ left: -8, top: -8 }}>
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className={`w-full h-full rounded-full bg-green transition-all duration-300 ease-out`}
                  style={{ transform: isHovered ? 'scale(1.35)' : 'scale(0)' }}
                />
              </div>
            </div>
          </a>
          {/* <p className="mt-2 font-sans font-semibold text-md mb-2 z-50 select-none">SAME GRASSHOPPER, NEW DIGS</p> */}
        </div>
      </div>
      <div className="w-76 flex flex-col items-center" />
    </div>
  )
}

export default Home
