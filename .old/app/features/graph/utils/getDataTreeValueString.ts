import { NodePen } from 'glib'
import { distance3d } from './distance3d'

export const getDataTreeValueString = (data: NodePen.DataTreeValue<NodePen.SolutionValueType>): string => {
  switch (data.type) {
    case 'boolean': {
      const { value } = data as NodePen.DataTreeValue<'boolean'>

      return value ? 'True' : 'False'
    }
    case 'circle': {
      return 'Circle'
    }
    case 'curve': {
      return 'Curve'
    }
    case 'domain': {
      const { value } = data as NodePen.DataTreeValue<'domain'>

      const { minimum, maximum } = value

      return `${minimum} to ${maximum}`
    }
    case 'integer': {
      const { value } = data as NodePen.DataTreeValue<'integer'>

      return Math.round(value).toString()
    }
    case 'line': {
      const { value } = data as NodePen.DataTreeValue<'line'>

      const { from: f, to: t } = value

      const d = distance3d([f.x, f.y, f.z], [t.x, t.y, t.z])

      return `Line(L:${d.toFixed(2)} u)`
    }
    case 'number': {
      const { value } = data as NodePen.DataTreeValue<'number'>

      return value.toString()
    }
    case 'path': {
      return 'Path'
    }
    case 'plane': {
      const { value } = data as NodePen.DataTreeValue<'plane'>

      const { origin: o, normal: z } = value

      return `O(${o.x.toFixed(2)},${o.y.toFixed(2)},${o.z.toFixed(2)}) Z(${z.x.toFixed(2)},${z.y.toFixed(
        2
      )},${z.z.toFixed(2)})`
    }
    case 'point': {
      const { value } = data as NodePen.DataTreeValue<'point'>

      const { x, y, z } = value

      return `{${x}, ${y}, ${z}}`
    }
    case 'rectangle': {
      const { value } = data as NodePen.DataTreeValue<'rectangle'>

      const { width, height } = value

      return `Rectangle (w=${width.toFixed(2)}, h=${height.toFixed(2)})`
    }
    case 'text': {
      const { value } = data as NodePen.DataTreeValue<'text'>

      return value
    }
    case 'transform': {
      const { value } = data as NodePen.DataTreeValue<'transform'>

      const { x, y, z } = value

      return `Move {${x}, ${y}, ${z}}`
    }
    case 'vector': {
      const { value } = data as NodePen.DataTreeValue<'vector'>

      const { x, y, z } = value

      return `{${x}, ${y}, ${z}}`
    }
    default: {
      console.log(`🐍 Not sure how to parse '${(data as any).type}' value as string.`)
      return `Unknown ${(data as any).type} value`
    }
  }
}
