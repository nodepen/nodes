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

  const [showModal, setShowModal] = useState(false)

  return (
    <div className="w-vw p-0 flex flex-col overflow-hidden" style={{ minHeight: minHeight }}>
      <div className="w-full h-10 min-h-10 pl-8 pr-8 border-b-2 border-dark bg-light flex flex-row justify-evenly items-center z-50">
        <div className="w-6 overflow-visible flex-grow" />
        <a className="font-display text-lg no-underline select-none" href="/">
          nodepen
        </a>
        <div className="w-6 overflow-visible flex-grow flex flex-row justify-end items-center">
          <button
            className="p-1 pl-2 pr-2 font-display rounded-sm bg-white flex items-center justify-center transition-colors duration-150 hover:bg-gray-100"
            onClick={() => setShowModal((current) => !current)}
          >
            <div className="font-display text-xs font-thin text-dark">pre-release</div>
            <div className="w-4 h-4 ml-2 rounded-full border-2 border-dark flex flex-col items-center justify-center text-xs">
              ?
            </div>
          </button>
        </div>
      </div>
      {showModal ? (
        <div
          className="w-full flex flex-col justify-center items-center z-50"
          style={{ position: 'fixed', height: window.innerHeight - 40, background: 'rgba(0, 0, 0, 0.3)', top: 40 }}
          onClick={() => setShowModal(false)}
          role="presentation"
        >
          <div className="w-76 lg:w-128 p-4 rounded-md border-2 border-dark bg-white flex flex-col">
            <h1 className="text-lg mb-2">Thank you for tinkering with pre-release NodePen:</h1>
            <ol className="mb-2">
              <li className="leading-5 mb-1">
                A limited (but growing!) list of standard Grasshopper components are available.
              </li>
              <li className="leading-5 mb-1">
                This was meant for a weekend infrastructure test. You will experience performance issues.
              </li>
              <li className="leading-5 mb-1">
                The database can be wiped at any time, clearing anything that might persist today.
              </li>
            </ol>
            <hr className="mb-2 border-b-2 border-dark" />
            <p className="text-lg mb-2">
              Currently tracking dozens of known issues and missing features. But feedback is always welcome:
            </p>
            <div className="w-full mb-3 flex flex-row items-center">
              <a
                href="https://github.com/cdriesler/nodepen/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 mr-2 rounded-md border-2 border-dark text-center"
              >
                Open a GitHub issue
              </a>
              <a
                href="https://twitter.com/cdriesler"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 mr-2 rounded-md border-2 border-dark text-center"
              >
                Send a tweet
              </a>
            </div>
            <hr className="mb-2 border-b-2 border-dark" />
            <p className="text-lg mb-2">NodePen is free software and is licensed to you under AGPL 3.0:</p>
            <div className="w-full flex flex-row items-center">
              <a
                href="https://github.com/cdriesler/nodepen"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 mr-2 rounded-md border-2 border-dark text-center"
              >
                View source
              </a>
            </div>
          </div>
        </div>
      ) : null}
      {children}
    </div>
  )
}
