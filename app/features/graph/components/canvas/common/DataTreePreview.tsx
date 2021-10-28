import React from 'react'
import { NodePen } from 'glib'
import { Typography } from 'features/common'
import { getDataTreePreviewStrings } from '@/features/graph/utils'

type DataTreePreviewProps = {
  elementId: string
  parameterId: string
  tree?: NodePen.DataTree
  details?: string
  loading: boolean
}

export const DataTreePreview = ({
  elementId,
  parameterId,
  tree,
  details,
  loading,
}: DataTreePreviewProps): React.ReactElement => {
  const prefix = `${elementId}-${parameterId}-data-`

  const entries = getDataTreePreviewStrings(tree ?? {})

  return (
    <div className={`w-full p-2 flex flex-col justify-start items-center`}>
      {loading ? (
        <div className="w-full h-16 flex justify-center items-center">
          <div style={{ transform: 'scaleX(-1) ' }}>
            <svg
              className="w-6 h-6 animate-spin-inv"
              fill="#98E2C6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      ) : (
        <>
          <Typography.Data size="sm" color="dark">
            {details}
          </Typography.Data>
          {entries.map((entry, i) => (
            <Typography.Data key={`${prefix}-value-${i}`} size="sm" color="dark">
              {entry}
            </Typography.Data>
          ))}
        </>
      )}
    </div>
  )
}
