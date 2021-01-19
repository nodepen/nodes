import React from 'react'

type RuntimeMessageProps = {
  message: string
  level: 'error' | 'warning' | 'info'
}

export const RuntimeMessageContainer = ({ message, level }: RuntimeMessageProps): React.ReactElement => {
  return (
    <div className="mt-2 mb-2 w-full flex flex-col">
      <div className="w-full mb-1 flex flex-row items-center">
        <svg className="w-5 h-5" fill="none" stroke="#093824" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="font-panel font-medium text-xs">{message.toUpperCase()}.</div>
    </div>
  )
}
