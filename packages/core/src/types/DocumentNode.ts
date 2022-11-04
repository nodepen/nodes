import type { DataTree } from "./data"

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
  /** Anchors represent important positions on the node in world space. */
  anchors: {
    /** Anchors are stored as deltas from the current `position` */
    [anchorId: string]: {
      dx: number
      dy: number
    }
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
    [inputInstanceId: string]: DataTree
  }
  inputs: {
    [inputInstanceId: string]: number
  }
  outputs: {
    [outputInstanceId: string]: number
  }
}
