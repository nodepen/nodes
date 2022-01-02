import { Layout } from '@/features/common'
import React from 'react'
import { LandingSectionContent } from '../types'

type LandingSectionProps = {
  content: LandingSectionContent
  shape: 'circle' | 'square' | 'triangle' | 'plus'
}

export const LandingSection = ({ content, shape }: LandingSectionProps): React.ReactElement => {
  const { title, copy, icon, graphic } = content

  const GRID_COUNT = 100

  const shapes: { [key in typeof shape]: JSX.Element } = {
    circle: <circle cx="5" cy="5" r="5" fill="white" />,
    square: <></>,
    triangle: <></>,
    plus: <></>,
  }

  const backgroundGraphic = (
    <svg width="300" height="300" viewBox="0 0 10 10" className="overflow-visible mask">
      <defs>
        <mask id="mask" maskUnits="userSpaceOnUse">
          <rect x="-1" y="-1" width="12" height="12" fill="black" />
          {shapes[shape]}
        </mask>
      </defs>
      <g mask="url(#mask)">
        {Array(GRID_COUNT)
          .fill('')
          .map((_, n) => {
            const pct = n / GRID_COUNT

            const min = -15
            const max = 25

            const w = max - min

            const i = pct * w + min

            return (
              <>
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
              </>
            )
          })}
      </g>
      <style jsx>{`
        @keyframes march {
          from {
            transform: translate(0px, 0px);
          }
          to {
            transform: translate(6px, -6px);
          }
        }

        .grid {
          animation-name: march;
          animation-duration: 15s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </svg>
  )

  return (
    <div className="relative w-full">
      <div className="absolute left-0 top-0 w-full z-10">
        <div className="w-full flex flex-col">
          <div className="w-full mb-1 flex items-center justify-start">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="#333" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  vectorEffect="non-scaling-stroke"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-dark">Test Title Here</h3>
          </div>
        </div>
        <Layout.Columns>
          <div className="w-full pl-12">
            <p className="text-lg font-medium text-dark">
              NodePen is a platform for creating, sharing, and exploring Grasshopper scripts online. Try something out,
              learn something new, and share it with the world — all from the comfort of your favorite web browser.
            </p>
          </div>
          <div id="section-graphic" className="w-full" />
        </Layout.Columns>
      </div>
      <div
        className="absolute left-0 top-0 rounded-md z-0"
        style={{ width: 300, height: 300, transform: `translate(calc(-50% + 24px), calc(-25% + 24px))` }}
      >
        {backgroundGraphic}
      </div>
    </div>
  )
}
