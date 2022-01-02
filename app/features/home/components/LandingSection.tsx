import { Layout } from '@/features/common'
import React from 'react'
import { LandingSectionContent } from '../types'

type LandingSectionProps = {
  content: LandingSectionContent
}

export const LandingSection = ({ content }: LandingSectionProps): React.ReactElement => {
  const { title, copy, icon, graphic, shape } = content

  const GRID_COUNT = 50
  const GRID_SPEED = 25 + Math.random() * 10

  const shapes: { [key in typeof shape]: JSX.Element } = {
    circle: <circle cx="5" cy="5" r="5" fill="white" />,
    square: (
      <rect
        x="1"
        y="1"
        width="8"
        height="8"
        rx="0.5"
        ry="0.5"
        fill="white"
        style={{ transformOrigin: '50% 50%', transform: 'rotate(33deg)' }}
      />
    ),
    plus: (
      <g style={{ transformOrigin: '50% 50%', transform: 'rotate(-20deg)' }}>
        <line x1="5" y1="1" x2="5" y2="9" stroke="white" strokeWidth={2.5} strokeLinecap="round" />
        <line x1="1" y1="5" x2="9" y2="5" stroke="white" strokeWidth={2.5} strokeLinecap="round" />
      </g>
    ),
    triangle: (
      <polygon points="0,1 10,1 5,10" fill="white" style={{ transformOrigin: '50% 50%', transform: 'rotate(-9deg)' }} />
    ),
  }

  return (
    <div className="w-full mb-48 h-48">
      <div className="relative w-full">
        <div className="absolute left-0 top-0 w-full z-10">
          <div className="w-full flex flex-col">
            <div className="w-full mb-1 flex items-center justify-start">
              <div className="w-12 h-12 mr-2 flex items-center justify-center" style={{ minWidth: 48 }}>
                {icon}
              </div>
              <h3 className="text-2xl font-semibold text-dark">{title}</h3>
            </div>
          </div>
          <Layout.Columns>
            <div className="w-full pl-14">
              <p className="text-lg font-medium text-dark">{copy}</p>
            </div>
            <div className="w-full">
              <img src={graphic} alt="" />
            </div>
          </Layout.Columns>
        </div>
        <div
          className="absolute left-0 top-0 rounded-md z-0"
          style={{ width: 300, height: 300, transform: `translate(calc(-50% + 24px), calc(-25% + 24px))` }}
        >
          <svg width="300" height="300" viewBox="0 0 10 10" className="overflow-visible">
            <defs>
              <mask id={`mask-${shape}`} maskUnits="userSpaceOnUse">
                <rect x="-10" y="-10" width="30" height="30" fill="black" />
                {shapes[shape]}
              </mask>
            </defs>
            <g mask={`url(#mask-${shape})`}>
              {Array(GRID_COUNT)
                .fill('')
                .map((_, n) => {
                  const pct = n / GRID_COUNT

                  const min = -15
                  const max = 25

                  const w = max - min

                  const i = pct * w + min

                  return (
                    <g key={`grid-lines-${n}`}>
                      <line
                        className="grid"
                        x1={i}
                        y1={min}
                        x2={i}
                        y2={max}
                        stroke="#98E2C6"
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                      />
                      <line
                        className="grid"
                        x1={min}
                        y1={i}
                        x2={max}
                        y2={i}
                        stroke="#98E2C6"
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  )
                })}
            </g>
          </svg>
        </div>
      </div>
      <style jsx>{`
        @keyframes march {
          from {
            transform: translate(0px, 0px);
          }
          to {
            transform: translate(12px, -12px);
          }
        }

        .grid {
          animation-name: march;
          animation-duration: ${GRID_SPEED}s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}
