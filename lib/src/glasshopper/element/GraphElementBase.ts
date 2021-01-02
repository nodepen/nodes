import { GraphElementType } from './GraphElementType'

export interface GraphElementBase {
  id: string
  template: {
    type: GraphElementType
  }
  current: {
    position: [number, number]
    values: { [key: string]: string[] }
  }
}
