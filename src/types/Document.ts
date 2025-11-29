import type { DocumentNode } from './DocumentNode'

export type Document = {
  id: string
  nodes: { [id: string]: DocumentNode }
  meta: {
    name: string
  } & Record<string, any>
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
