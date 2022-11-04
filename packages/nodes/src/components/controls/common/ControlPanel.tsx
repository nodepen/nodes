import React from 'react'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'

type ControlPanelProps = {
  children: React.ReactNode
}

export const ControlPanel = ({ children }: ControlPanelProps): React.ReactElement => {
  const shadowTargetRef = usePseudoShadow()

  return (
    <div
      ref={shadowTargetRef}
      className="np-w-full np-p-4 np-mb-3 np-bg-green np-rounded-md np-shadow-main np-pointer-events-auto"
    >
      {children}
    </div>
  )
}
