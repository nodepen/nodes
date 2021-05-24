import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useGraphManager } from 'context/graph'
import { categorize } from '../../utils'

export const GraphControls = (): React.ReactElement => {
  const { library } = useGraphManager()

  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

  const libraryByCategory = useMemo(() => categorize(library ?? []), [library])

  const [selectedCategory, setSelectedCategory] = useState('params')

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

  const componentToolbarRef = useRef<HTMLDivElement>(null)

  const handleScroll = (delta: number): void => {
    if (!componentToolbarRef.current) {
      return
    }

    componentToolbarRef.current.scroll({ left: componentToolbarRef.current.scrollLeft + delta })
  }

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
          <div className="w-full h-12" />
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
          <button
            className="w-12 h-12 flex justify-center items-center transition-colors duration-75 md:hover:bg-swampgreen"
            onClick={() => handleScroll((sidebarWidth - 96) / -2)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#093824"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            className="h-full w-full whitespace-nowrap overflow-x-auto no-scrollbar"
            style={{ width: sidebarWidth - 96 }}
            ref={componentToolbarRef}
          >
            {library
              ? null
              : Array.from(Array(6)).map((_, i) => (
                  <div
                    key={`library-skeleton-${i}`}
                    className="w-12 h-12 inline-block transition-colors duration-75 md:hover:bg-swampgreen"
                  >
                    <div className="w-full h-full flex justify-center items-center">
                      <div className="w-8 h-8 rounded-sm animate-pulse bg-swampgreen" />
                    </div>
                  </div>
                ))}
          </div>
          <button
            className="w-12 h-12 flex justify-center items-center transition-colors duration-75 md:hover:bg-swampgreen"
            onClick={() => handleScroll((sidebarWidth - 96) / 2)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#093824"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
