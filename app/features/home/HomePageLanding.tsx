import React from 'react'
import { NextPage } from 'next'
import { QuirkyDivider } from './components'

/**
 * Home page for unauthenticated visits.
 */
const HomePageLanding: NextPage = () => {
  return (
    <div className="w-vw h-vh overflow-auto">
      <div className="w-full h-10 bg-green sticky top-0 z-50" />
      <div className="w-full h-48 flex flex-col justify-end bg-green">
        <QuirkyDivider topColor="#98E2C6" bottomColor="#eff2f2" animate />
      </div>
      <div className="w-full flex flex-col justify-end bg-pale" style={{ height: 1250 }}>
        <QuirkyDivider topColor="#eff2f2" bottomColor="#ffffff" />
      </div>
      <div className="w-full h-24 bg-white" />
    </div>
  )
}

export default React.memo(HomePageLanding)
