import type { DataTree } from '@nodepen/core'

export const getDataTreeSummary = (tree?: DataTree | null): string => {
  if (!tree || !tree.stats) {
    return ''
  }

  const { branchCount, valueCount, types } = tree.stats

  const commonTypeName = types.length > 0 && types.every((t) => t === types[0]) ? types[0] : 'value'

  return [
    `${branchCount} list${branchCount === 1 ? '' : 's'}`,
    `of ${valueCount}`,
    `${commonTypeName}${valueCount === 1 ? '' : 's'}`,
  ].join(' ')
}
