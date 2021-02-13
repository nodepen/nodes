import React, { useState, useEffect } from 'react'

type RootLayoutProps = {
  children?: React.ReactNode
}

export const RootLayout = ({ children }: RootLayoutProps): JSX.Element => {
  const [height, setHeight] = useState<number>()

  useEffect(() => {
    const h = window.innerHeight

    setHeight(h)
  }, [])

  return (
    <div className="w-vw p-0 flex flex-col overflow-hidden" style={{ height: height ?? '100vh' }}>
      <div className="w-full h-10 min-h-10 pl-8 pr-8 border-b-2 border-dark bg-light flex flex-row justify-evenly items-center z-50">
        <div className="w-6 overflow-visible flex-grow" />
        <a className="font-display text-lg no-underline select-none" href="/">
          nodepen
        </a>
        <a
          href="http://github.com/cdriesler/nodepen"
          rel="noopener noreferrer"
          target="_blank"
          className="w-6 overflow-visible flex-grow flex flex-row justify-end items-center"
        >
          <div className="font-display text-xs font-thin text-dark">pre-release</div>
        </a>
      </div>
      {children}
    </div>
  )
}
