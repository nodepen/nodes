import React from 'react'
import { SidebarControl } from './sidebar'

const ControlsContainer = (): React.ReactElement => {
  return (
    <div className="w-full h-full np-relative">
      <SidebarControl />
    </div>
  )
}

export default React.memo(ControlsContainer)
