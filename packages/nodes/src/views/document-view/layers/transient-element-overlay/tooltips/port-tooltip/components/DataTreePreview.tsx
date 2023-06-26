import React from 'react'
import type { DataTree } from '@nodepen/core'
import { getDataTreeStructure, getDataTreeValueString } from '@/utils/data-trees'

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
              <>
                <div>{i}</div>
                <div>{getDataTreeValueString(value)}</div>
              </>
            ))}
            <div className="np-col-span-full np-h-8 np-bg-error" />
            <div>{values.length - 1}</div>
            <div>{getDataTreeValueString(lastValue)}</div>
          </>
        )
      }
      default: {
        return null
      }
    }
  }

  return (
    <div className="np-w-full np-p-2 np-grid np-grid-cols-[min-content_1fr] np-grid-flow-row-dense np-gap-1 np-rounded-sm np-bg-grey np-text-xs np-font-mono np-font-semibold">
      {getContent()}
    </div>
  )
}
