import React from 'react'
import { Typography } from '@/features/common'

type SaveProgressMenuProps = {
  progress: number
  message: string
}

export const SaveProgressMenu = ({ progress, message }: SaveProgressMenuProps): React.ReactElement => {
  const TOTAL_WIDTH = 192

  const progressWidth = (progress / 100) * TOTAL_WIDTH

  return (
    <div className="pt-2 pb-2 rounded-md bg-green">
      <div className="w-48">
        <svg width={TOTAL_WIDTH} height="5" viewBox="0 0 192 4" className="overflow-visible">
          <line
            x1="0"
            y1="3"
            x2={TOTAL_WIDTH}
            y2="3"
            stroke="#7BBFA5"
            strokeWidth="2px"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="0"
            y1="3"
            x2={progressWidth}
            y2="3"
            stroke="#093824"
            strokeWidth="2px"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="w-full pl-1 pr-1 flex items-center justify-between">
        <div className="w-6 h-6 flex items-center justify-center">
          {/* <div className="w-4 h-4 bg-swampgreen rounded-full" /> */}
        </div>
        <Typography.Label size="sm" color="darkgreen" justify="end">
          {message}
        </Typography.Label>
      </div>
    </div>
  )
}
