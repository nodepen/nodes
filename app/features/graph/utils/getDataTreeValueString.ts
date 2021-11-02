import { NodePen } from 'glib'

export const getDataTreeValueString = (data: NodePen.DataTreeValue<NodePen.SolutionValueType>): string => {
  switch (data.type) {
    case 'boolean': {
      const { value } = data as NodePen.DataTreeValue<'boolean'>

      return value ? 'True' : 'False'
    }
    case 'integer': {
      const { value } = data as NodePen.DataTreeValue<'integer'>

      return Math.round(value).toString()
    }
    case 'number': {
      const { value } = data as NodePen.DataTreeValue<'number'>

      return value.toString()
    }
    case 'point': {
      const { value } = data as NodePen.DataTreeValue<'point'>

      const { x, y, z } = value

      return `{${x}, ${y}, ${z}}`
    }
    case 'text': {
      const { value } = data as NodePen.DataTreeValue<'text'>

      return value
    }
    case 'vector': {
      const { value } = data as NodePen.DataTreeValue<'vector'>

      const { x, y, z } = value

      return `{${x}, ${y}, ${z}}`
    }
    default: {
      console.log(`🐍 Not sure how to parse '${data.type}' value as string.`)
      return data.value.toString()
    }
  }
}
