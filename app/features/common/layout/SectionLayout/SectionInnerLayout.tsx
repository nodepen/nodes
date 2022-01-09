import React from 'react'

type SectionInnerLayoutProps = {
  children?: JSX.Element
}

export const SectionInnerLayout = ({ children }: SectionInnerLayoutProps): React.ReactElement => {
  return (
    <div className="w-full pl-4 pr-4 flex justify-center">
      <div className="w-full" style={{ maxWidth: 960 }}>
        {children}
      </div>
    </div>
  )
}
