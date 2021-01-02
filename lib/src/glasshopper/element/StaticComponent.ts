import { GraphElementBase } from './GraphElementBase'
import { Component } from '../../grasshopper/Component'

export class StaticComponent implements GraphElementBase {
  public id: string
  public template: { type: 'static-component' } & Component
  public current: {
    position: [number, number]
    values: { [key: string]: string[] }
  }

  constructor(id: string, position: [number, number], component: Component) {
    this.id = id
    this.template = { type: 'static-component', ...component }
    this.current = { position, values: {} }
  }
}
