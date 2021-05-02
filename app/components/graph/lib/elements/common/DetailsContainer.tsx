import React from 'react'

type DetailsContainerProps = {
  pinned: boolean
  onPin: () => void
  children?: React.ReactNode
}

export const DetailsContainer = ({ pinned, onPin, children }: DetailsContainerProps): React.ReactElement => {
  return (
    <div className="flex flex-col bg-pale w-48 border-2 border-green rounded-md overflow-hidden">
      <div className="w-full h-8 bg-green flex flex-col justify-end relative overflow-visible" />
      <div className="w-full p-2">{children}</div>
    </div>
  )
}
