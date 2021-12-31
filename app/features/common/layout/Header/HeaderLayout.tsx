import React from 'react'
import { HeaderBranding } from './components'

type HeaderLayoutProps = {
  children?: JSX.Element
}

export const HeaderLayout = ({ children }: HeaderLayoutProps): React.ReactElement => {
  return (
    <div className="w-full h-10 flex items-center justify-start bg-green sticky top-0">
      <HeaderBranding />
      <div className="flex-grow h-full p-1 pr-2 flex justify-end items-center">{children}</div>
    </div>
  )
}
