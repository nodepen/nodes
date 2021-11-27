import React from 'react'
import { NextPage } from 'next'
import { QuirkyDivider } from './components'

const HomePage: NextPage = () => {
  return (
    <div className="w-vw h-vh overflow-auto">
      <div className="w-full h-10 bg-green sticky top-0 z-50" />
      <div className="w-full h-48 flex flex-col justify-end bg-green">
        <QuirkyDivider topColor="#98E2C6" bottomColor="#eff2f2" animate />
      </div>
      <div className="w-full bg-pale" style={{ height: 2000 }} />
    </div>
  )
}

export default React.memo(HomePage)
