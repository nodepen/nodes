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
    values: { [key: string]: string[] }
  }
}
