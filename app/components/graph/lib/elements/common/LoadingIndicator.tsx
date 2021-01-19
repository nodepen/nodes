import React from 'react'

type LoadingProps = {
  visible: boolean
}

export const LoadingIndicator = ({ visible }: LoadingProps): React.ReactElement => {
  return (
    <div
      className={`${
        visible ? 'opacity-100' : 'opacity-0'
      } w-full h-full flex justify-center items-center transition-opacity duration-150`}
    >
      <div className="w-8 h-4 flex justify-center items-center">
        <div className="h-4 animate-bounce flex flex-col justify-end" style={{ animationDelay: '150ms' }}>
          <div className="w-1 h-1 rounded-full bg-darkgreen" />
        </div>
        <div className="h-4 ml-1 animate-bounce flex flex-col justify-end" style={{ animationDelay: '300ms' }}>
          <div className="w-1 h-1 rounded-full bg-darkgreen" />
        </div>
        <div className="h-4 ml-1 animate-bounce flex flex-col justify-end" style={{ animationDelay: '450ms' }}>
          <div className="w-1 h-1 rounded-full bg-darkgreen" />
        </div>
      </div>
    </div>
  )
}
