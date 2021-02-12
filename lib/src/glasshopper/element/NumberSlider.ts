import { GraphElementBase } from './GraphElementBase'
import { Component } from '../../grasshopper/Component'

export interface NumberSlider extends GraphElementBase {
  template: { type: 'number-slider' } & Component
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
    domain: [number, number]
    precision: number // 0 = int, >= 1 is 'digits' after 0
    value: number
  }
}
