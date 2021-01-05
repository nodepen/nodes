import React from 'react'

type DetailsContainerProps = {
  pinned: boolean
  onPin: () => void
  children?: React.ReactNode
}

export const DetailsContainer = ({ pinned, onPin, children }: DetailsContainerProps): React.ReactElement => {
  return (
    <div className="flex flex-col bg-pale w-48 border-2 border-green rounded-md overflow-hidden">
      <div className="w-full h-8 bg-green flex flex-col justify-end relative overflow-visible">
        <button
          onClick={() => onPin()}
          className="absolute w-4 h-4 flex justify-center items-center"
          style={{ top: 4, left: 9, color: pinned ? '#093824' : '#EFF2F2' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
        <div
          className="w-full h-6 pl-2 pr-2 absolute flex flex-row justify-center items-center"
          style={{ bottom: '-12px' }}
        >
          <div className={`h-3 flex-grow rounded-full border-2 border-green bg-pale`} />
        </div>
      </div>
      <div className="w-full p-2">{children}</div>
    </div>
  )
}
