import { GraphElementBase } from './GraphElementBase'
import { Component } from '../../grasshopper/Component'

export interface StaticComponent extends GraphElementBase {
  template: { type: 'static-component' } & Component
  current: {
    position: [number, number]
    inputs: { [key: string]: number }
    outputs: { [key: string]: number }
    values: { [key: string]: { [key: string]: string[] } }
  }
}
