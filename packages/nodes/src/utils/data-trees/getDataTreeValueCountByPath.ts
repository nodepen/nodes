import type { DataTree } from '@nodepen/core'

export const getDataTreeValueCountByPath = (data?: DataTree | null): [min: number, max: number] => {
  if (!data) {
    return [-1, -1]
  }

  const pathLengths = Object.values(data).reduce((counts, branch) => {
    return [...counts, branch.length]
  }, [] as number[])

  pathLengths.sort((a, b) => a - b)

  console.log(pathLengths)

  const min = pathLengths.at(0)
  const max = pathLengths.at(-1)

  if (min === undefined || max === undefined) {
    return [-1, -1]
  }

  return [min, max]
}
