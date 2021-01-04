import { GraphElementBase } from './GraphElementBase'
import { Component } from '../../grasshopper/Component'

export interface StaticParameter extends GraphElementBase {
  template: { type: 'static-parameter' } & Component
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
    values: { [key: string]: string[] }
  }
}
