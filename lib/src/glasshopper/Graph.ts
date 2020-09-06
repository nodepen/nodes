import { Component } from './Component'

export interface Graph {
  components: Component[]
  targets: string[]
  session: {
    id: string
  }
}
