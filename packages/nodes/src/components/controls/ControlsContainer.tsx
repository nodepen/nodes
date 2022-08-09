import React from 'react'
import { CameraControl } from './camera'
import { SidebarControl } from './sidebar'

const ControlsContainer = (): React.ReactElement => {
  return (
    <div className="w-full h-full np-absolute np-z-50">
      <div className="w-full h-full np-relative">
        <SidebarControl />
        <CameraControl />
      </div>
    </div>
  )
}

export default React.memo(ControlsContainer)
