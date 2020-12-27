type GraphElementType = 'StaticComponent' | 'Panel' | 'Wire'

export interface GraphElement {
  id: string
  template: {
    type: GraphElementType
  }
  current: {
    position: [number, number]
    groups: string[]
  }
}