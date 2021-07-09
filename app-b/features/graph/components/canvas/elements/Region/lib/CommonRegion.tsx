import React from 'react'

type CommonRegionProps = {
  style: React.CSSProperties
}

export const CommonRegion = ({ style }: CommonRegionProps): React.ReactElement => {
  return <div className="w-full h-full" style={style} />
}
