import { NodePen } from 'glib'

export const getDataTreeValueString = (data: NodePen.DataTreeValue<NodePen.SolutionValueType>): string => {
  switch (data.type) {
    case 'number': {
      const { value } = data as NodePen.DataTreeValue<'number'>

      return value.toString()
    }
    case 'string': {
      const { value } = data as NodePen.DataTreeValue<'string'>

      return value
    }
    default: {
      console.log(`🐍 Not sure how to parse '${data.type}' value as string.`)
      return data.value.toString()
    }
  }
}
