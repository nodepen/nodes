import type { DataTree } from '@nodepen/core'

export const getDataTreeTypes = (data?: DataTree | null): string[] => {
  const types: string[] = []

  if (!data) {
    return types
  }

  for (const branch of Object.values(data)) {
    for (const value of branch) {
      const type = value.type.toLowerCase()

      if (!types.includes(type)) {
        types.push(type)
      }
    }
  }

  return types
}
