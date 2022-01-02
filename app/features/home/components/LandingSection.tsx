import { Layout } from '@/features/common'
import React from 'react'
import { LandingSectionContent } from '../types'

type LandingSectionProps = {
  content: LandingSectionContent
}

export const LandingSection = ({ content }: LandingSectionProps): React.ReactElement => {
  const { title, copy, icon, backgroundGraphic, featureGraphic } = content

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
        className="absolute left-0 top-0 rounded-md bg-swampgreen z-0"
        style={{ width: 300, height: 300, transform: `translate(calc(-50% + 24px), calc(-25% + 24px))` }}
      ></div>
    </div>
  )
}
