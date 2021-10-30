import { NodePen } from 'glib'

export const getDataTreeValueString = (data: NodePen.DataTreeValue<NodePen.SolutionValueType>): string => {
  switch (data.type) {
    case 'integer': {
      const { value } = data as NodePen.DataTreeValue<'integer'>

      return Math.round(value).toString()
    }
    case 'number': {
      const { value } = data as NodePen.DataTreeValue<'number'>

      return value.toString()
    }
    case 'text': {
      const { value } = data as NodePen.DataTreeValue<'text'>

      return value
    }
    default: {
      console.log(`🐍 Not sure how to parse '${data.type}' value as string.`)
      return data.value.toString()
    }
  }
}
