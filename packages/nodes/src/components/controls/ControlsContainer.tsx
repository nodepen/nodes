import React, { useCallback } from 'react'
import { Layer } from '@/views/common'
import { ActiveViewControl, DocumentInfoControl, PinnedPortsControl, TemplateLibraryControl } from './panels'

const ControlsContainer = (): React.ReactElement => {
  return (
    <ControlsContainerLayout>
      {/* <DocumentInfoControl /> */}
      <ActiveViewControl />
      <PinnedPortsControl />
      {/* <TemplateLibraryControl templates={templates} /> */}
    </ControlsContainerLayout>
  )
}

import { DownloadButton, HomeButton, ProfileButton, ShareButton } from './navigation'
import { SolutionStatusBar } from './solution-status'

type LayoutProps = {
  children: React.ReactNode
}

const ControlsContainerLayout = ({ children }: LayoutProps): React.ReactElement => {
  return (
    <Layer fixed id="np-controls-layer" z={90}>
      <div className="np-w-full np-h-full np-relative">
        <div className="np-w-full np-h-full np-overflow-hidden np-absolute np-flex np-flex-row np-justify-start np-items-center np-pointer-events-none np-z-50">
          <div className="np-h-full np-w-72 np-p-4 np-flex np-flex-col">
            <div id="np-control-panels" className="np-w-full np-flex-grow np-flex np-flex-col">
              {children}
            </div>
            <div
              id="np-navigation-panels"
              className="np-w-full np-h-8 np-flex np-justify-between np-items-center np-gap-2"
            >
              <HomeButton />
              <ShareButton />
              <DownloadButton />
              <SolutionStatusBar />
              <ProfileButton />
            </div>
          </div>
        </div>
      </div>
    </Layer>
  )
}

export default React.memo(ControlsContainer)
