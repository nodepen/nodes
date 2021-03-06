import React, { useEffect, useState } from 'react'

type RootLayoutProps = {
  children?: React.ReactNode
}

export const RootLayout = ({ children }: RootLayoutProps): JSX.Element => {
  const [minHeight, setMinHeight] = useState(0)

  useEffect(() => {
    setMinHeight(window.innerHeight)
  }, [])

  const handleResize = (): void => {
    if (window.innerWidth < 750) {
      return
    }

    setMinHeight(window.innerHeight)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <div className="w-vw p-0 flex flex-col overflow-hidden" style={{ minHeight: minHeight }}>
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
