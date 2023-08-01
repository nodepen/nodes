import type { DocumentNode } from './DocumentNode'

export type Document = {
  id: string
  nodes: { [id: string]: DocumentNode }
  configuration: {
    inputs: {
      nodeInstanceId: string
      portInstanceId: string
    }[]
    outputs: {
      nodeInstanceId: string
      portInstanceId: string
    }[]
  }
  version: 1
}
