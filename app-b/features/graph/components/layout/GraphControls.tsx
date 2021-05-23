import React, { useState, useEffect } from 'react'
import { useGraphManager } from 'context/graph'

export const GraphControls = (): React.ReactElement => {
  const { library } = useGraphManager()

  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = (): void => {
      const w = window.innerWidth
      setSidebarWidth(Math.max(Math.min(w - 48, 400), 200))
    }

    if (sidebarWidth === 0) {
      handleResize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return (
    <div className="w-full h-12 relative bg-green overflow-visible z-50">
      <div
        className="pl-4 pr-4 bg-green absolute transition-all duration-150 ease-out"
        style={{ left: sidebarIsOpen ? 0 : -sidebarWidth, top: 0, height: '100vh', width: sidebarWidth }}
      >
        <div className="w-full h-full overflow-auto no-scrollbar">
          {/* <div
            className="mt-4 mb-4 bg-swampgreen"
            style={{ width: sidebarWidth - 32, height: (sidebarWidth - 32) * 0.75 }}
          ></div> */}
          <div className="w-full h-12 mt-4 mb-4 sticky bg-swampgreen top-0" />
          {library?.map((el) => (
            <div>{el.nickname}</div>
          ))}
        </div>
      </div>
      {sidebarWidth < 400 && sidebarIsOpen ? (
        <button
          className="absolute w-12 h-vh z-50 opacity-0"
          style={{ left: sidebarWidth, top: 48 }}
          onClick={() => setSidebarIsOpen(false)}
        />
      ) : null}
      <div
        className="w-full h-12 absolute transition-all duration-150 top-0"
        style={{ left: sidebarIsOpen ? sidebarWidth : 0 }}
      >
        <div className="w-full h-full flex flex-row justify-start items-center ease-out">
          <button
            className="w-12 h-12 flex justify-center items-center transition-colors duration-75 md:hover:bg-swampgreen"
            onClick={() => setSidebarIsOpen((current) => !current)}
          >
            {sidebarIsOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#093824"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#093824"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
