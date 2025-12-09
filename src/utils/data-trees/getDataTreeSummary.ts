import type { DataTree } from '@/types'

export const getDataTreeSummary = (tree?: DataTree | null): string => {
  if (!tree || !tree.stats) {
    return ''
  }

  const { branchCount, valueCount, valueTypes, branchValueCountDomain } = tree.stats

  const commonTypeName = valueTypes.length > 0 && valueTypes.every((t) => t === valueTypes[0]) ? valueTypes[0] : 'value'

  const valueCountString = branchValueCountDomain[0] === branchValueCountDomain[1] ? `${branchValueCountDomain[0]}` : `${branchValueCountDomain[0] - branchValueCountDomain[1]}`

  return [
    `${branchCount} list${branchCount === 1 ? '' : 's'}`,
    `of ${valueCountString}`,
    `${commonTypeName}${valueCountString === '1' ? '' : 's'}`,
  ].join(' ')
}
