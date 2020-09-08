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
      <div className="w-48 h-8 arrow">
        <svg width="192px" height="32" viewBox="0 0 192 32">
          <line x1="4" y1="16" x2="188" y2="16" stroke="#333333" strokeWidth="0.8mm" strokeLinecap="round" />
          <line x1="188" y1="16" x2="174" y2="2" stroke="#333333" strokeWidth="0.8mm" strokeLinecap="round" />
          <line x1="188" y1="16" x2="174" y2="30" stroke="#333333" strokeWidth="0.8mm" strokeLinecap="round" />
        </svg>
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
        <div className="card-mono w-64 lg:w-76 z-10 p-2 flex flex-col justify-center items-center">
          <h1 className="font-display text-3xl mb-2">glasshopper.io</h1>
          <p className="font-sans font-semibold text-sm mb-2">COMING SOON</p>
        </div>
      </div>
      <a
        href="https://github.com/cdriesler/glasshopper.io"
        target="_blank"
        rel="noreferrer"
        className="font-sans font-semibold text-sm"
      >
        <div className="w-48 h-10 card-mono transition-all duration-150 ease-in-out hover:cursor-pointer transform translate-y-0 hover:translate-y-hov-sm flex flex-row">
          <div className="w-10 border-r border-dark flex justify-center items-center">
            <img alt="The official GitHub logo." src="/github.svg" width="24px" height="24px" />
          </div>
          <div className="flex-grow flex flex-row justify-center items-center">
            <div className="font-sans font-semibold text-sm">VIEW UPDATES</div>
          </div>
        </div>
      </a>
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
