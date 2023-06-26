import React from 'react'
import type { DataTreeValue } from '@nodepen/core'
import { getDataTreeValueString } from '@/utils/data-trees'

type DataTreePreviewEntryProps = {
  index: number
  value: DataTreeValue
  showBackground?: boolean
}

export const DataTreePreviewEntry = ({ index, value, showBackground = false }: DataTreePreviewEntryProps) => {
  const valueString = getDataTreeValueString(value)

  return (
    <>
      <div
        className={`${
          showBackground ? 'np-bg-grey-2' : ''
        } np-p-1 np-pr-2 np-pb-0 np-rounded-tl-sm np-rounded-bl-sm np-text-right np-font-semibold`}
      >
        <div className="-np-translate-y-px">{index}</div>
      </div>
      <div
        className={`${
          showBackground ? 'np-bg-grey-2' : ''
        } np-p-1 np-pb-0 np-rounded-tr-sm np-rounded-br-sm np-font-medium`}
      >
        <div className="-np-translate-y-px">{valueString}</div>
      </div>
    </>
  )
}
