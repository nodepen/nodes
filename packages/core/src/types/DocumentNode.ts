export type DocumentNode = {
  instanceId: string
  templateId: string
  /** Current top-left coordinate of node in world space. */
  position: {
    x: number
    y: number
  }
  /** Current width and height of node in world dimensions. */
  dimensions: {
    width: number
    height: number
  }
  /** Data providers for inputs on this node. */
  sources: {
    [inputInstanceId: string]: {
      nodeInstanceId: string
      portInstanceId: string
    }[]
  }
  /** Data values manually set for inputs on this node. */
  values: {
    [inputInstanceId: string]: unknown
  }
  inputs: {
    [inputInstanceId: string]: number
  }
  outputs: {
    [outputInstanceId: string]: number
  }
}
