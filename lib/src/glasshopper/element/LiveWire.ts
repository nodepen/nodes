import { GraphElementBase } from './GraphElementBase'

export interface LiveWire extends GraphElementBase {
  template: { type: 'live-wire' }
  current: {
    position: [number, number]
    dimensions: {
      width: number
      height: number
    }
    anchors: { [key: string]: [number, number] }
    from: [number, number]
    to: [number, number]
  }
}
