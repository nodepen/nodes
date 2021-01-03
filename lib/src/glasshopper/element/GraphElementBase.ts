import { GraphElementType } from './GraphElementType'

export interface GraphElementBase {
  id: string
  template: {
    type: GraphElementType
  }
  current: {
    position: [number, number]
    dimensions: {
      width: number
      height: number
    }
    anchors: { [key: string]: [number, number] } // Notable positions in graph coordinate space
  }
}
