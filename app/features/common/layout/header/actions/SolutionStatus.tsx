import React, { useRef, useState } from 'react'
import { useSolutionMetadata } from 'features/graph/store/solution/hooks'
import { Typography } from '../../..'
import { useSessionManager } from '@/features/common/context/session'

const SolutionStatus = (): React.ReactElement => {
  const { user } = useSessionManager()

  const isLocked = user?.isAnonymous || !user

  const meta = useSolutionMetadata()

  const [showDetails, setShowDetails] = useState(false)
  const pipRef = useRef<HTMLDivElement>(null)
  const pipAnchor = useRef<[number, number]>([0, 0])

  const icon = (() => {
    if (isLocked) {
      return (
        <svg className="w-5 h-5" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      )
    }

    switch (meta.phase) {
      case 'idle': {
        return meta.error ? (
          <svg className="w-5 h-5" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )
      }
      default: {
        return (
          <svg className="w-5 h-5 animate-spin" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        )
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
    if (!user || user?.isAnonymous) {
      return 'Please sign in to enable the solver.'
    }

    if (isLocked) {
      return 'Grasshopper solver is locked.'
    }

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
        className="w-6 h-6 mr-1 flex items-center justify-start"
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
            <Typography.Label size="sm" color="dark" select={false}>
              {message}
            </Typography.Label>
          </div>
        </div>
      </div>
    </>
  )
}

export default React.memo(SolutionStatus)
