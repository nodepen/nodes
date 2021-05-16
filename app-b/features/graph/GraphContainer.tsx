import React from 'react'
import { Layout } from './components'

export const GraphContainer = (): React.ReactElement => {
  return (
    <div className="w-full h-full flex flex-col justify-start">
      <div className="w-full h-8 bg-green" />
      <div className="w-full flex-grow relative">
        <div className="w-full h-full absolute z-0">
          <Layout.Grid />
        </div>
        <div className="w-full h-full absolute z-10">
          <Layout.Canvas />
        </div>
      </div>
    </div>
  )
}
