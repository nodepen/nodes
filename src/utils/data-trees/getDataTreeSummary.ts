import type { DataTree } from '@nodepen/core'

export const getDataTreeSummary = (tree?: DataTree | null): string => {
  if (!tree || !tree.stats) {
    return ''
  }

  const { branchCount, valueCount, valueTypes } = tree.stats

  const commonTypeName = valueTypes.length > 0 && valueTypes.every((t) => t === valueTypes[0]) ? valueTypes[0] : 'value'

  return [
    `${branchCount} list${branchCount === 1 ? '' : 's'}`,
    `of ${valueCount}`,
    `${commonTypeName}${valueCount === 1 ? '' : 's'}`,
  ].join(' ')
}
