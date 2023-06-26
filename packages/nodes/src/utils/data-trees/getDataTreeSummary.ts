import type { DataTree } from '@nodepen/core'
import { getDataTreeStructure } from '.'
import { getDataTreeTypes } from './getDataTreeTypes'

export const getDataTreeSummary = (data?: DataTree | null): string => {
  if (!data) {
    return ''
  }

  switch (getDataTreeStructure(data)) {
    case 'empty': {
      return ''
    }
    case 'single': {
      const value = Object.values(data)[0][0]
      return `1 ${value.type}`
    }
    case 'list': {
      const values = Object.values(data)[0]
      const types = getDataTreeTypes(data)

      return `1 list of ${types.length === 1 ? types[0] : 'value'}${values.length === 1 ? '' : 's'}`
    }
    case 'tree': {
      const depth = Object.keys(data).length
      const types = getDataTreeTypes(data)

      return `${depth} list${depth === 1 ? '' : 's'} of ${types.length === 1 ? types[0] : 'value'}s`
    }
  }
}
