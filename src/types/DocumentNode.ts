import type { DataTree } from './data'
import type { PortConfiguration } from './ports'

export type DocumentNode = {
  instanceId: string
  templateId: string
  /** Current top-left coordinate of node in world space. */
  position: {
    x: number
    y: number
  }
  /** Transient status flags associated with the given document node. */
  status: {
    /** If false, the node should not be allowed to run during solutions. */
    isEnabled: boolean
    /** If true, the node has not yet been committed to the document and should not be included in solutions. */
    isProvisional: boolean
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
    /** The horizontal center of where the node label is drawn. */
    labelDeltaX: {
      dx: number
      dy: 0
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
  portConfigurations: {
    [portInstanceId: string]: PortConfiguration
  }
}
