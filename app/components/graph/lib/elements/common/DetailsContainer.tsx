import React from 'react'

type DetailsContainerProps = {
  children?: React.ReactNode
}

export const DetailsContainer = ({ children }: DetailsContainerProps): React.ReactElement => {

  return (
    <div className="flex flex-col bg-pale w-48 border-2 border-green rounded-md overflow-hidden">
      <div className="w-full h-8 bg-green flex flex-col justify-end relative overflow-visible">
        <div className="w-full h-6 pl-2 pr-2 absolute flex flex-row justify-center items-center" style={{ bottom: '-12px' }}>
          <div className={`h-3 flex-grow rounded-full border-2 border-green bg-pale`} />
        </div>
      </div>
      <div className="w-full p-2">
        {children}
      </div>
    </div>
  )
}