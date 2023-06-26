import React from 'react'
import type { DataTree } from '@nodepen/core'
import { getDataTreeStructure, getDataTreeValueString } from '@/utils/data-trees'
import { DataTreePreviewEntry } from './DataTreePreviewEntry'
import { COLORS } from '@/constants'

type DataTreePreviewProps = {
  dataTree: DataTree
}

export const DataTreePreview = ({ dataTree }: DataTreePreviewProps) => {
  const entries = Object.entries(dataTree)

  const structure = getDataTreeStructure(dataTree)

  const getContent = () => {
    switch (structure) {
      case 'list': {
        const [_path, values] = entries[0]

        const firstValues = values.slice(0, 5)
        const lastValue = values.at(-1)

        return (
          <>
            {firstValues.map((value, i) => (
              <DataTreePreviewEntry index={i} value={value} showBackground={i % 2 === 0} />
            ))}
            {values.length >= 5 && lastValue ? (
              <>
                <div className="np-col-span-full np-h-2 np-w-full np-flex np-justify-center np-items-center np-overflow-visible np-z-10">
                  <svg width={138} height={20} className="np-overflow-visible">
                    <polyline
                      points="-5,10 60,10 64,6 68,10 72,14 76,10 143,10"
                      stroke={COLORS.LIGHT}
                      strokeWidth={2}
                      vectorEffect="non-scaling-stroke"
                      fill="none"
                    />
                  </svg>
                </div>
                <DataTreePreviewEntry index={values.length - 1} value={lastValue} showBackground />
              </>
            ) : null}
          </>
        )
      }
      default: {
        return null
      }
    }
  }

  return (
    <div className="np-w-full np-p-1 np-grid np-grid-cols-[min-content_1fr] np-grid-flow-row-dense np-rounded-sm np-bg-grey np-text-xs np-font-mono np-font-semibold">
      {getContent()}
    </div>
  )
}
