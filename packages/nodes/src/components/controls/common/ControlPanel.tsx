import React from 'react'
import { usePseudoShadow } from '@/views/common/pseudo-shadow'

type ControlPanelProps = {
  children: React.ReactNode
  disablePadding?: boolean
}

export const ControlPanel = ({ children, disablePadding }: ControlPanelProps): React.ReactElement => {
  const shadowTargetRef = usePseudoShadow("controls")

  return (
    <div
      ref={shadowTargetRef}
      className={`${disablePadding ? '' : 'np-p-4'} np-w-full np-mb-3 np-bg-green np-rounded-md np-shadow-main np-pointer-events-auto`}
    >
      {children}
    </div>
  )
}
