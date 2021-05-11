import React, { useState, useEffect, useMemo, useRef } from 'react'

const Teaser = () => {
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

  return (
    <div className="w-vw h-vh bg-green flex flex-col justify-evenly items-center lg:flex-row">
      <div className="w-76 flex flex-col items-center">
        <p>1212</p>
        <p>245</p>
      </div>
      <div
        ref={circleRef}
        className="w-76 h-76 lg:w-128 lg:h-128 rounded-full bg-pale overflow-hidden flex flex-col justify-center items-center"
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
        <div className="card-mono rounded-md w-64 lg:w-76 z-10 p-2 flex flex-col justify-center items-center">
          <h1 className="font-display text-3xl mb-2">nodepen</h1>
          <p className="font-sans font-semibold text-sm mb-2">SAME GRASSHOPPER, NEW DIGS</p>
        </div>
      </div>
      <div className="w-76 flex flex-col items-center">
        <a href="/alpha/graph" className="font-sans font-semibold text-sm">
          <div className="w-48 h-10 card-mono rounded-md transition-all duration-150 ease-in-out hover:cursor-pointer transform translate-y-0 hover:translate-y-hov-sm flex flex-row">
            <div className="flex-grow flex flex-row justify-center items-center">
              <div className="font-sans font-semibold text-sm">LAUNCH NODEPEN</div>
            </div>
          </div>
        </a>{' '}
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

export default Teaser
