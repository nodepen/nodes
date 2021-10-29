import React, { useEffect, useState, useRef, useCallback } from 'react'
import { UnderlayPortal } from '../../underlay'
import { useSolutionMessages, useSolutionPhase } from 'features/graph/store/solution/hooks'
import { useCameraZoomLevel } from '@/features/graph/store/camera/hooks'

type RuntimeMessageContainerProps = {
  elementId: string
}

type RuntimeMessage = {
  message: string
  level: 'warning' | 'error'
}

const RuntimeMessageContainer = ({ elementId }: RuntimeMessageContainerProps): React.ReactElement | null => {
  const messages = useSolutionMessages()
  const phase = useSolutionPhase()
  const zoomLevel = useCameraZoomLevel()

  const [internalMessages, setInternalMessages] = useState<RuntimeMessage[]>()
  const [internalColor, setInternalColor] = useState<'bg-warn' | 'bg-error'>('bg-warn')

  const [shouldExist, setShouldExist] = useState(false)
  const cleanupTimeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (phase === 'idle') {
      const incomingMessages = messages[elementId]

      if (incomingMessages && incomingMessages.length > 0) {
        const { level } = incomingMessages[0]

        if (cleanupTimeout.current) {
          clearTimeout(cleanupTimeout.current)
        }

        switch (level) {
          case 'warning':
            setInternalColor('bg-warn')
            break
          case 'error':
            setInternalColor('bg-error')
            break
          default:
            console.log(`🐍 Unhandled runtime message level '${level}'`)
        }

        setShouldExist(true)
      } else {
        cleanupTimeout.current = setTimeout(() => {
          setShouldExist(false)
          setInternalMessages(undefined)
        }, 350)
      }

      cleanupTimeout.current = setTimeout(() => {
        setInternalMessages(incomingMessages)
      }, 50)
    }
  }, [phase])

  const visible = !!internalMessages && internalMessages.length > 0 && zoomLevel !== 'far'

  const [showMessage, setShowMessage] = useState(false)

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') {
      return
    }

    setShowMessage(true)
  }, [])

  const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') {
      return
    }

    setShowMessage(false)
  }, [])

  const { message } = internalMessages?.[0] ?? { message: '' }

  if (!shouldExist) {
    return null
  }

  return (
    <UnderlayPortal parent={elementId} anchor="top">
      <div
        className="w-full h-128 flex flex-col justify-end items-center rounded-md overflow-visible pointer-events-none"
        style={{ transform: `translateY(-${16 + 512}px)` }}
      >
        <div
          className="w-128 h-128 flex flex-col justify-end items-center transition-transform duration-300 ease-out"
          style={{ transform: visible ? 'translateY(0)' : 'translateY(96px)' }}
        >
          <div
            className={`${internalColor} h-10 rounded-md flex items-center justify-start transition-width duration-300 ease-out pointer-events-auto overflow-hidden z-10 `}
            style={{
              maxWidth: 296,
              // maxHeight: showMessage ? 500 : 40,
              transitionProperty: 'max-width max-height',
              transitionDuration: '300ms',
              transitionTimingFunction: 'ease-out',
            }}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
          >
            <div className="w-10 h-10 flex justify-center items-center">
              <svg className="w-6 h-6" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div
              className={`${
                showMessage ? 'w-64' : 'w-0'
              } overflow-hidden pb-2 pt-2 whitespace-nowrap transition-width duration-300 ease-out`}
            >
              {message}
            </div>
          </div>
          <div
            className={`${internalColor} w-8 h-8 rounded-md pointer-events-auto z-0`}
            style={{ transform: 'translateY(-20px) rotate(45deg) ' }}
          />
        </div>
      </div>
    </UnderlayPortal>
  )
}

export default React.memo(RuntimeMessageContainer)
