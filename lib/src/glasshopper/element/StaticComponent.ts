import { GraphElementBase } from './GraphElementBase'
import { Component } from '../../grasshopper/Component'
import { DataTree } from '../tree'

export interface StaticComponent extends GraphElementBase {
  template: { type: 'static-component' } & Component
  current: {
    position: [number, number]
    dimensions: {
      width: number
      height: number
    }
    anchors: { [key: string]: [number, number] }
    inputs: { [key: string]: number } // Maps instance id to template input
    outputs: { [key: string]: number }
    sources: {
      [key: string]: {
        element: string
        parameter: string
      }[]
    }
    solution?: string
    values: { [inputId: string]: DataTree } // [instancedId][data tree path] = values
  }
}
