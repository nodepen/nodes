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
