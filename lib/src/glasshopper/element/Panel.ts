import { GraphElementBase } from './GraphElementBase'
import { Component } from '../../grasshopper/Component'

export interface Panel extends GraphElementBase {
  template: { type: 'panel' } & Component
  current: {
    position: [number, number]
    dimensions: {
      width: number
      height: number
    }
    anchors: { [key: string]: [number, number] }
    sources: {
      [key: string]: {
        element: string
        parameter: string
      }[]
    }
  }
}
