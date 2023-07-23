import React from 'react'
import type { DataTree } from '@nodepen/core'
import { tryGetSingleValue } from '@/utils/data-trees'
import { DataTreePreviewEntry } from './DataTreePreviewEntry'
import { COLORS } from '@/constants'

type DataTreePreviewProps = {
  dataTree: DataTree
}

export const DataTreePreview = ({ dataTree }: DataTreePreviewProps) => {
  const { branches } = dataTree
  const { treeStructure } = dataTree.stats

  const cutoffDivider = (
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
  )

  const getContent = () => {
    switch (treeStructure) {
      case 'single': {
        const value = tryGetSingleValue(dataTree)

        if (!value) {
          return null
        }

        return <DataTreePreviewEntry entryValue={value} />
      }
      case 'list': {
        const { path, values } = branches[0]

        const firstValues = values.slice(0, 5)
        const lastValue = values.at(-1)

        return (
          <>
            {firstValues.map((value, i) => (
              <DataTreePreviewEntry
                key={`tree-preview-${path}-${i}`}
                entryKey={i}
                entryValue={value}
                showBackground={i % 2 === 0}
              />
            ))}
            {values.length >= 5 && lastValue ? (
              <>
                {cutoffDivider}
                <DataTreePreviewEntry entryKey={values.length - 1} entryValue={lastValue} showBackground />
              </>
            ) : null}
          </>
        )
      }
      case 'tree': {
        const firstBranches = branches.slice(0, 5)

        const lastBranch = branches.at(-1)
        const lastBranchValue = `n=${lastBranch?.values.length}`

        return (
          <>
            {firstBranches.map(({ path, values }, i) => (
              <DataTreePreviewEntry
                key={`tree-preview-${path}`}
                entryKey={path}
                entryValue={`n=${values.length}`}
                showBackground={i % 2 === 0}
              />
            ))}
            {branches.length >= 5 && lastBranch ? (
              <>
                {cutoffDivider}
                <DataTreePreviewEntry entryKey={lastBranch.path} entryValue={lastBranchValue} showBackground />
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
