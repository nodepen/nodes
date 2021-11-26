import React from 'react'
import { NextPage } from 'next'

const HomePage: NextPage = () => {
  return (
    <div className="w-vw h-vh overflow-auto">
      <div className="w-full h-10 bg-green sticky top-0" />
      <div className="w-full bg-red-500" style={{ height: 2000 }} />
    </div>
  )
}

export default React.memo(HomePage)
