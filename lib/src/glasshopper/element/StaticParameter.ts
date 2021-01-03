import { GraphElementBase } from './GraphElementBase'
import { Component } from '../../grasshopper/Component'

export interface StaticParameter extends GraphElementBase {
  template: { type: 'static-parameter' } & Component
  current: {
    position: [number, number]
    values: { [key: string]: string[] }
  }
}
