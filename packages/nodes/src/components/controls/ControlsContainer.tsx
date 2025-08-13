import React from 'react'
import { Layer } from '@/views/common'
import { useDispatch, useStore } from '$'
import {
  DocumentInfoControl,
  PinnedInputsControl,
  PinnedOutputsControl,
  TemplateLibraryControl,
} from './panels'

const ControlsContainer = (): React.ReactElement => {
  const templates = useStore((state) => state.templates)

  return (
    <ControlsContainerLayout>
      {/* <DocumentInfoControl /> */}
      <PinnedInputsControl />
      <PinnedOutputsControl />
      <TemplateLibraryControl templates={templates} />
    </ControlsContainerLayout>
  )
}

import { DownloadButton, HelpButton, LikeButton, ShareButton } from './navigation'
import { SolutionStatusBar } from './solution-status'
import ActiveUserControl from './users/ActiveUserControl'
import DocumentToolsControl from './tools/DocumentToolsControl'

type LayoutProps = {
  children: React.ReactNode
}

const ControlsContainerLayout = ({ children }: LayoutProps): React.ReactElement => {
  const shadowResizeProxyRef = useStore((state) => state.registry.shadows.proxyRefs['controls'])

  const { clearInterface } = useDispatch()

  return (
    <Layer fixed id="np-controls-layer" z={90}>
      <div className="np-w-full np-h-full np-relative">
        <div className="np-w-full np-h-full np-overflow-hidden np-absolute np-flex np-flex-col np-justify-end np-items-center np-pointer-events-none np-z-50">
          <div className='np-w-full np-pb-8 np-grid np-grid-cols-3'>
            <div className='np-w-full np-h-full np-flex np-flex-grow np-justify-start np-items-center'>
              <ActiveUserControl />
            </div>
            <div className='np-w-full np-h-full np-flex np-flex-grow np-justify-center np-items-center'>
              <DocumentToolsControl />

            </div>
            <div className='np-w-full np-h-full np-flex np-flex-grow np-justify-end np-items-center'>
              <div className='np-w-16 np-h-8 np-bg-light np-shadow-main'>
                X
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layer>
  )
}

export default React.memo(ControlsContainer)
