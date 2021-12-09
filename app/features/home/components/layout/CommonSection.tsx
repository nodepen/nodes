import React from 'react'

type CommonSectionProps = {
  children?: JSX.Element
}

export const CommonSection = ({ children }: CommonSectionProps): React.ReactElement => {
  return (
    <div className="w-full pl-4 pr-4 flex flex-col items-center justify-start">
      <div className="w-full flex flex-col items-center justify-start" style={{ maxWidth: 960 }}>
        {children}
      </div>
    </div>
  )
}
