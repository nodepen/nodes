import type * as NodePen from '@nodepen/core'

export const getDataTreeValueString = (dataTreeValue?: NodePen.DataTreeValue): string => {
  if (!dataTreeValue) {
    return 'undefined'
  }

  if (dataTreeValue.valueString) {
    return dataTreeValue.valueString
  }

  switch (dataTreeValue.type) {
    case 'string': {
      const { value } = dataTreeValue
      return value
    }
    case 'number':
    case 'integer': {
      const { value } = dataTreeValue
      return value.toString()
    }
    default: {
      console.log(`🐍 Cannot parse unknown data type [${dataTreeValue.type}] as a string!`)
      return `(${dataTreeValue.type.toLowerCase()} value)`
    }
  }
}
