import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { NextPage } from 'next'
// import Link from 'next/link'
import Head from 'next/head'

const Home: NextPage = () => {
  const [[w, h], setCircleDimensions] = useState<[number, number]>([0, 0])
  const [offset, setOffset] = useState(0)

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
    const march = setInterval(() => {
      setOffset((offset + speed) % 0.25)
    }, 40)
    return () => clearInterval(march)
  }, [offset])

  const [[dx, dy], setMaskOffset] = useState<[number, number]>([0, 48])

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
    const max = 4
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

  return (
    <div
      className="w-vw h-vh bg-green flex flex-col justify-evenly items-center lg:flex-row"
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
      <div className="w-76 flex flex-col items-center">
        <a
          className="rounded-sm mb-1 p-2 pl-4 pr-4 flex items-center hover:bg-swampgreen"
          href="https://twitter.com/cdriesler"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="h-4 mr-2" src="/logos/twitter.svg" alt="The Twitter logo." />
          <p className=" text-darkgreen font-semibold font-md">VIEW UPDATES</p>
        </a>
        <a
          className="rounded-sm mt-1 p-2 pl-4 pr-4 flex items-center hover:bg-swampgreen"
          href="https://github.com/cdriesler/nodepen"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="h-6 mr-2" src="/logos/github.svg" alt="The GitHub logo." />
          <p className=" text-darkgreen font-semibold font-md">VIEW CODE</p>
        </a>
      </div>
      <div
        ref={circleRef}
        className={`w-76 h-76 lg:w-128 lg:h-128 rounded-full bg-pale overflow-hidden flex flex-col justify-center items-center`}
        style={{ transform: `translate(${dx * 0.05}px, ${dy * 0.05}px)` }}
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
          className={`bg-pale rounded-full w-full h-full p-2 flex flex-col justify-center items-center z-50`}
          style={{ transform: `translate(${dx}px, ${dy}px)` }}
        >
          <img
            className={`h-16 mt-2 mb-1`}
            src="/nodepen-brand.svg"
            alt="The NodePen logo."
            title="NodePen: Same Grasshopper, New Digs"
            style={{ transform: `translate(${dx * -0.9}px, ${dy * -0.9}px)` }}
          />
          {/* <p className="mt-2 font-sans font-semibold text-md mb-2 z-50 select-none">SAME GRASSHOPPER, NEW DIGS</p> */}
        </div>
      </div>
      <div className="w-76 flex flex-col items-center">
        {/* <Link href="/gh" prefetch={false}> */}
        <a href="/gh" className="font-sans font-semibold text-sm">
          <div className="w-48 h-10 border-2 border-solid border-dark shadow-osm bg-light rounded-md transition-all duration-150 ease-in-out hover:cursor-pointer transform translate-y-0 hover:translate-y-hov-sm flex flex-row">
            <div className="flex-grow flex flex-row justify-center items-center">
              <div className="font-sans font-semibold text-sm">LAUNCH NODEPEN</div>
            </div>
          </div>
        </a>
        {/* </Link> */}
      </div>

      <style jsx>{`
        @keyframes arrowloop {
          from {
            transform: translateX(-15px);
          }
          to {
            transform: translateX(15px);
          }
        }

        .arrow {
          animation-name: arrowloop;
          animation-duration: 800ms;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
      `}</style>
    </div>
  )
}

export default Home
