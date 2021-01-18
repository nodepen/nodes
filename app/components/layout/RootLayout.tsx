import React from 'react'

type RootLayoutProps = {
  children?: React.ReactNode
}

export const RootLayout = ({ children }: RootLayoutProps): JSX.Element => {
  return (
    <div className="w-vw h-vh p-0 flex flex-col overflow-hidden">
      <div className="w-full h-10 min-h-10 pl-8 pr-8 border-b-2 border-dark bg-light flex flex-row justify-evenly items-center z-50">
        <div className="w-6 overflow-visible flex-grow" />
        <a className="font-display text-lg no-underline select-none" href="/">
          glasshopper.io
        </a>
        <a
          href="http://github.com/cdriesler/glasshopper.io"
          rel="noopener noreferrer"
          target="_blank"
          className="w-6 overflow-visible flex-grow flex flex-row justify-end items-center"
        >
          <div className="font-display text-xs font-thin text-dark">pre-release</div>
          <div className="ml-2 p-1 pl-2 pr-2 rounded-sm bg-dark font-display text-xs font-thin text-light">
            α&nbsp;07
          </div>
        </a>
      </div>
      {children}
    </div>
  )
}
