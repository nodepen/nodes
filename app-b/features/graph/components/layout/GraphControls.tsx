import { useState, useEffect } from 'react'
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
        className="bg-green absolute transition-all duration-150 ease-out"
        style={{ left: sidebarIsOpen ? 0 : -sidebarWidth, top: 0, height: 'calc(100vh - 40)', width: sidebarWidth }}
      />
      <div
        className="w-full h-12 absolute transition-all duration-150 top-0"
        style={{ left: sidebarIsOpen ? sidebarWidth : 0 }}
      >
        <div className="w-full h-full flex flex-row justify-start items-center ease-out">
          <button className="w-12 h-12 bg-red-500" onClick={() => setSidebarIsOpen((current) => !current)} />
        </div>
      </div>
    </div>
  )
}
