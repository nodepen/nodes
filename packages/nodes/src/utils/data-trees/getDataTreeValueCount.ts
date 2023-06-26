import type { DataTree } from '@nodepen/core'

export const getDataTreeValueCount = (data?: DataTree | null): number => {
  if (!data) {
    return 0
  }

  return Object.values(data).reduce((total, branch) => {
    return total + branch.length
  }, 0)
}
