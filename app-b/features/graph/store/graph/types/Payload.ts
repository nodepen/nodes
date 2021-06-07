import { NodePen } from 'glib'

export type AddElementPayload<T extends NodePen.ElementType> = {
  type: T
  template: NodePen.Element<T>['template']
  position: [number, number]
}

export type MoveElementPayload = {
  id: string
  position: [number, number]
}

export type ConnectElementsPayload = {
  mode: 'replace' | 'merge'
  from: {
    elementId: string
    parameterId: string
  }
  to: {
    elementId: string
    parameterId: string
  }
}

export type ProvisionalWirePayload = {
  from: {
    elementId: string
    parameterId: string
  }
  to: {
    elementId: string
    parameterId: string
  }
}

export type RegisterElementPayload = {
  id: string
  dimensions: [width: number, height: number]
}

export type RegisterElementAnchorPayload = {
  elementId: string
  anchorId: string
  /** Anchors are offsets from parent element's position. */
  position: [dx: number, dy: number]
}

export type StartLiveWirePayload = {
  type: 'input' | 'output'
  elementId: string
  parameterId: string
}

export type UpdateLiveWirePayload = {
  type: 'from' | 'to'
  position: [x: number, y: number]
}

export type CaptureLiveWirePayload = {
  /** Type of parameter attempting capture */
  type: 'input' | 'output'
  elementId: string
  parameterId: string
}
