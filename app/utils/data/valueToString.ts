import { Glasshopper } from 'glib'

export const valueToString = (value: Glasshopper.Data.DataTreeValue<Glasshopper.Data.ValueType>): string => {
  switch (value.type) {
    case 'number': {
      const data = value.data as number
      return data.toString()
    }
    case 'string': {
      const data = value.data as string
      return data
    }
    case 'point': {
      const { x, y, z } = value.data as Glasshopper.Geometry.Point
      return `{${x}, ${y}, ${z}}`
    }
    default: {
      return `${value.type[0].toUpperCase()}${value.type.slice(1)}`
    }
  }
}
