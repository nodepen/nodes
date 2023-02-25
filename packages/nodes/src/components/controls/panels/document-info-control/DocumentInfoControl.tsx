import React from 'react'
import { COLORS } from '@/constants'
import { ControlPanel, ControlPanelHeader } from '../../common'

export const DocumentInfoControl = (): React.ReactElement => {
  const icon = (
    <svg width={24} aria-hidden="true" fill="none" stroke={COLORS.DARKGREEN} strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <ControlPanel>
      <ControlPanelHeader
        icon={icon}
        label={"Twisty Tower"}
        sublabel={"chuck"}
        onClickMenu={() => ''}
      />
      {/* <div className='np-w-full np-pl-9'>
        CONTENT
      </div> */}
    </ControlPanel>
  )
}
