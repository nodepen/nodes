import React from 'react'
import type { DataTreeValue } from '@nodepen/core'

type DataTreePreviewEntryProps = {
  entryKey?: string | number
  entryValue: DataTreeValue | string
  showBackground?: boolean
}

export const DataTreePreviewEntry = ({ entryKey, entryValue, showBackground = false }: DataTreePreviewEntryProps) => {
  const valueString = typeof entryValue === 'string' ? entryValue : entryValue.description

  return entryKey === undefined ? (
    <div className="np-p-1 np-pb-0 np-font-semibold -np-translate-y-px np-whitespace-nowrap np-overflow-hidden">
      {valueString}
    </div>
  ) : (
    <>
      <div
        className={`${
          showBackground ? 'np-bg-grey-2' : ''
        } np-p-1 np-pr-2 np-pb-0 np-rounded-tl-sm np-rounded-bl-sm np-text-right np-font-semibold`}
      >
        <div className="-np-translate-y-px np-opacity-70">{entryKey}</div>
      </div>
      <div
        className={`${
          showBackground ? 'np-bg-grey-2' : ''
        } np-p-1 np-pb-0 np-rounded-tr-sm np-rounded-br-sm np-font-medium np-whitespace-nowrap np-overflow-hidden`}
      >
        <div className="-np-translate-y-px np-whitespace-nowrap np-overflow-hidden">{valueString}</div>
      </div>
    </>
  )
}
