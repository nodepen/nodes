import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useGraphManager } from '@/features/graph/context/graph'
import { categorize, flattenCategory } from '../../../utils'
import { ComponentLibraryIcon } from './components'
import { useSessionManager } from '@/features/common/context/session'
import { useSceneDispatch, useSceneDisplayMode } from '@/features/graph/store/scene/hooks'

export const GraphControls = (): React.ReactElement => {
  const { library } = useGraphManager()
  const { user, device } = useSessionManager()

  const { setDisplayMode } = useSceneDispatch()
  const sceneDisplayMode = useSceneDisplayMode()

  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

  const libraryByCategory = useMemo(() => categorize(library ?? []), [library])

  const [selectedCategory, setSelectedCategory] = useState('params')

  const selectedCategoryComponents = useMemo(
    () => flattenCategory(libraryByCategory, selectedCategory),
    [libraryByCategory, selectedCategory]
  )

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

    componentToolbarRef.current.scroll({ left: componentToolbarRef.current.scrollLeft + delta, behavior: 'smooth' })
  }

  const handleSelectCategory = (category: string): void => {
    setSelectedCategory(category.toLowerCase())
    setSidebarIsOpen(false)

    if (!componentToolbarRef.current) {
      return
    }

    componentToolbarRef.current.scroll({ left: 0 })
  }

  const handleShowModel = (): void => {
    setDisplayMode(sceneDisplayMode === 'show' ? 'hide' : 'show')
    setSidebarIsOpen(false)
  }

  return (
    <div className="w-full h-12 relative bg-green overflow-visible z-40">
      <div
        className=" bg-green absolute transition-all duration-150 ease-out"
        style={{ left: sidebarIsOpen ? 0 : -sidebarWidth, top: 0, height: '100vh', width: sidebarWidth }}
      >
        <div className="w-full h-full overflow-auto no-scrollbar">
          {/* <div className="w-full p-2 sticky bg-green top-0">
            <div className="w-full p-1 flex items-stretch rounded-md border-2 border-swampgreen">
              <div className="h-14 mr-2 rounded-sm bg-swampgreen" style={{ width: 74 }} />
              <div className="flex flex-col justify-start">
                <h3 className="text-xl text-darkgreen font-semibold">Twisty Tower</h3>
                <div className="pb-1 text-darkgreen flex-grow flex flex-col justify-end">
                  <p className="w-full flex flew-row items-center text-sm whitespace-nowrap">
                    by&nbsp;{' '}
                    <p className="font-semibold">
                      {user && user.isAnonymous ? 'Anonymous' : user?.displayName ?? 'You'}
                    </p>
                  </p>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="w-full p-2">
            <hr className="w-full border-t-2 border-swampgreen rounded-full" />
          </div> */}
          <button
            className="w-full h-12 flex justify-start items-center transition-colors duration-75 bg-green hover:bg-swampgreen"
            onClick={handleShowModel}
          >
            <div className="w-12 h-12 flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#093824"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="flex-grow h-full flex justify-start items-center">
              <p className="font-sans font-bold text-sm select-none">
                {sceneDisplayMode === 'show' ? 'CLOSE' : 'SHOW'} MODEL
              </p>
            </div>
          </button>
          <div className="w-full h-12 flex justify-start items-center">
            <div className="w-12 h-12 flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#093824"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <div className="flex-grow h-full flex justify-start items-center">
              <p className="font-sans font-bold text-sm select-none">COMPONENTS</p>
            </div>
          </div>
          {['Params', 'Maths', 'Sets', 'Vector', 'Curve', 'Mesh', 'Intersect', 'Transform'].map((category) => {
            const isSelected = selectedCategory === category.toLowerCase()
            return (
              <button
                key={`category-selector-${category}`}
                className="w-full h-8 flex justify-start items-center hover:font-bold"
                onClick={() => handleSelectCategory(category)}
              >
                <div className="w-12 h-full flex justify-center items-center">
                  {isSelected ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 10 10">
                      <circle cx={5} cy={5} r={1} stroke="none" fill="#093824" />
                    </svg>
                  ) : null}
                </div>
                <div className="flex-grow h-full flex justify-start items-center">
                  <p className={`${isSelected ? 'font-bold' : ''} font-sans text-sm select-none`}>{category}</p>
                </div>
              </button>
            )
          })}
          <div className="w-full h-12" />
        </div>
      </div>
      {sidebarIsOpen ? (
        <button
          className="absolute w-vw h-vh z-50 opacity-0"
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
            className="w-12 h-12 flex justify-center items-center md:hover:bg-swampgreen"
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
            className="w-12 h-12 flex justify-center items-center md:hover:bg-swampgreen"
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
            style={{ minWidth: sidebarWidth - 96, width: sidebarWidth - 96, touchAction: 'none' }}
            ref={componentToolbarRef}
          >
            {library
              ? selectedCategoryComponents.map((component) => (
                  <ComponentLibraryIcon key={`library-${component.guid}`} template={component} />
                ))
              : Array.from(Array(6)).map((_, i) => (
                  <div
                    key={`library-skeleton-${i}`}
                    className="w-12 h-12 inline-block transition-colors duration-75 md:hover:bg-swampgreen"
                  >
                    <div className="w-full h-full flex justify-center items-center">
                      <div className="w-6 h-6 rounded-sm animate-pulse bg-swampgreen" />
                    </div>
                  </div>
                ))}
          </div>
          <button
            className="w-12 h-12 flex justify-center items-center bg-green md:hover:bg-swampgreen z-20"
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
          {device.breakpoint !== 'sm' ? (
            <div className="h-full flex-grow flex justify-end items-center overflow-hidden">
              {sceneDisplayMode === 'show' ? (
                <button
                  className="w-12 h-12 flex justify-center items-center md:hover:bg-swampgreen"
                  onClick={() => setDisplayMode('hide')}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="#093824"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
