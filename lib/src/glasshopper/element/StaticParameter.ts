import { GraphElementBase } from './GraphElementBase'
import { Component } from '../../grasshopper/Component'
import { DataTree } from '../tree'

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
    solution: {
      id: string
      mode: 'immediate' | 'deferred'
    }
    runtimeMessage?: {
      message: string
      level: 'error' | 'warning' | 'info'
    }
    values: DataTree
  }
}
