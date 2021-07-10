import React from 'react'
import { Layout } from './components'

export const GraphContainer = (): React.ReactElement => {
  return (
    <div className="w-full h-full flex flex-col justify-start overflow-hidden">
      <Layout.Controls />
      <div className="w-full flex-grow relative bg-pale" style={{ WebkitUserSelect: 'none' }}>
        {/* <div className="w-full h-full absolute z-0">
          <Layout.StaticGrid />
        </div> */}
        <div className="w-full h-full absolute z-10">
          <Layout.Canvas />
        </div>
        <div className="w-full h-full absolute z-20 pointer-events-none">
          <Layout.Overlay />
        </div>
      </div>
    </div>
  )
}
