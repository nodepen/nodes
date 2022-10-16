import React from 'react'
import { useStore } from '$'
import { ControlPanel } from './common'
import { PinnedPortsControl } from './pinned-ports-control'

const ControlsContainer = (): React.ReactElement => {
  const configuration = useStore((store) => store.document.configuration)

  return (
    <ControlsContainerLayout>
      <ControlPanel>
        <PinnedPortsControl configuration={configuration} />
      </ControlPanel>
      {/* Navigation */}
    </ControlsContainerLayout>
  )
}

type LayoutProps = {
  children: React.ReactNode
}

const ControlsContainerLayout = ({ children }: LayoutProps): React.ReactElement => {
  return (
    <div className="w-full h-full np-relative">
      {/* <SidebarControl /> */}
      <div className="np-w-full np-h-full np-overflow-hidden np-absolute np-flex np-flex-row np-justify-start np-items-center np-pointer-events-none np-z-50">
        <div className="np-h-full np-w-72 np-p-4 np-flex np-flex-col">
          <div className="np-w-full np-flex-grow np-flex np-flex-col">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ControlsContainer)
