import { GraphElementBase } from './GraphElementBase'
import { Component } from '../../grasshopper/Component'

export class StaticParameter implements GraphElementBase {
  public id: string
  public template: { type: 'static-parameter' } & Component
  public current: {
    position: [number, number]
    values: { [key: string]: string[] }
  }

  constructor(id: string, position: [number, number], component: Component) {
    this.id = id
    this.template = { type: 'static-parameter', ...component }
    this.current = { position, values: {} }
  }
}
