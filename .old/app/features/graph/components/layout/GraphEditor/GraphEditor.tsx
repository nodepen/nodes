import React from 'react'
import { Header } from './header'

type EditorLayoutProps = {
  children?: JSX.Element
}

export const GraphEditor = ({ children }: EditorLayoutProps): React.ReactElement => {
  return (
    <div className="w-vw h-vh flex flex-col justify-start overflow-visible" id="layout-root">
      <Header />
      {children}
    </div>
  )
}
