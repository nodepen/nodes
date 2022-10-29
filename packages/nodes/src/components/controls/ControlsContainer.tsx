import React from 'react'
import { useStore } from '$'
import shallow from 'zustand/shallow'
import { Layer } from '@/views/common'
import { ActiveViewControl, DocumentInfoControl, PinnedPortsControl, TemplateLibraryControl } from './panels'

const ControlsContainer = (): React.ReactElement => {
  const configuration = useStore((store) => store.document.configuration)
  const templates = useStore((store) => store.templates, shallow)

  return (
    <ControlsContainerLayout>
      <DocumentInfoControl />
      <ActiveViewControl />
      <PinnedPortsControl pinnedPorts={configuration.pinnedPorts} />
      <TemplateLibraryControl templates={templates} />
    </ControlsContainerLayout>
  )
}

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
              <button className="np-w-8 np-h-8 np-rounded-md np-bg-light np-shadow-main np-pointer-events-auto" />
              <button className="np-w-8 np-h-8 np-rounded-md np-bg-light np-shadow-main np-pointer-events-auto" />
              <button className="np-w-8 np-h-8 np-rounded-md np-bg-light np-shadow-main np-pointer-events-auto" />
              <div className="np-flex-grow np-h-8 np-rounded-md np-bg-light np-shadow-main" />
              <button className="np-w-8 np-h-8 np-rounded-md np-bg-light np-shadow-main np-pointer-events-auto" />
            </div>
          </div>
        </div>
      </div>
    </Layer>
  )
}

export default React.memo(ControlsContainer)
