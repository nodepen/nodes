import React, { useEffect, useRef, useState } from 'react'
import { useSolutionMetadata } from 'features/graph/store/solution/hooks'

const SolutionStatusPip = (): React.ReactElement => {
  const meta = useSolutionMetadata()

  const [showDetails, setShowDetails] = useState(false)
  const pipRef = useRef<HTMLDivElement>(null)
  const pipAnchor = useRef<[number, number]>([0, 0])

  const icon = (() => {
    switch (meta.phase) {
      case 'idle': {
        return meta.error ? null : null
      }
      default: {
        return null
      }
    }
  })()

  const handlePointerEnter = (): void => {
    if (!pipRef.current) {
      return
    }

    const { left, top, width, height } = pipRef.current.getBoundingClientRect()

    const x = left + width / 2 - 256 + 24
    const y = top + height + 9

    pipAnchor.current = [x, y]
    // console.log({ x, y })
    setShowDetails(true)
  }

  const handlePointerLeave = (): void => {
    setShowDetails(false)
  }

  const message = (() => {
    switch (meta.phase) {
      case 'idle':
        return meta?.error ?? `Solution completed in ${meta.duration} ms.`
      default:
        return `Solving...`
    }
  })()

  return (
    <>
      <div
        className="w-full h-full flex items-center justify-start"
        ref={pipRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {icon}
      </div>
      <div
        className="absolute w-64 h-12 overflow-hidden pointer-events-none"
        style={{ left: pipAnchor.current[0], top: pipAnchor.current[1] }}
      >
        <div className="w-full h-full flex items-center justify-end">
          <div
            className="h-8 flex items-center pl-4 pr-4 bg-white rounded-md transition-transform duration-300 ease-out"
            style={{ transform: showDetails ? 'translateY(0px)' : 'translateY(-64px)' }}
          >
            {message}
          </div>
        </div>
      </div>
    </>
  )
}

export default React.memo(SolutionStatusPip)
