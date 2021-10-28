import React, { useEffect, useState } from 'react'
import { UnderlayPortal } from '../../underlay'
import { useSolutionMessages, useSolutionPhase } from 'features/graph/store/solution/hooks'

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

  const [internalMessages, setInternalMessages] = useState<RuntimeMessage[]>()

  useEffect(() => {
    if (phase === 'idle') {
      setInternalMessages(messages[elementId])
    }
  }, [phase])

  if (!internalMessages || internalMessages.length === 0) {
    return null
  }

  const { level, message } = internalMessages[0]

  return (
    <UnderlayPortal parent={elementId} anchor="top">
      <div
        className="w-full h-128 flex flex-col justify-end items-center rounded-md overflow-visible"
        style={{ transform: `translateY(-${16 + 512}px)` }}
      >
        <div className="w-128 h-128 flex flex-col justify-end items-center">
          <div
            className={`${
              level === 'warning' ? 'bg-warn' : 'bg-error'
            } w-10 h-10 rounded-md flex items-center justify-center z-10 transition-width duration-300 ease-out`}
          >
            <svg className="w-6 h-6" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {/* <div className="w-64 bg-warn rounded-md p-2 pl-4 pr-4 flex flex-col z-10">
          <h4 className="w-full h-8 flex justify-start items-center text-sm font-semibold">WARNING</h4>
          <p className="w-full h-8 text-md whitespace-nowrap overflow-hidden">Some detailed message goes here.</p>
        </div> */}
          <div
            className={`${level === 'warning' ? 'bg-warn' : 'bg-error'} w-8 h-8 rounded-md z-0`}
            style={{ transform: 'translateY(-20px) rotate(45deg) ' }}
          />
        </div>
      </div>
    </UnderlayPortal>
  )
}

export default React.memo(RuntimeMessageContainer)
