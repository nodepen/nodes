import { NodePen } from 'glib'

export type AddElementPayload<T extends NodePen.ElementType> = {
  type: T
  template: NodePen.Element<T>['template']
  data?: Partial<NodePen.Element<T>['current']>
  position: [number, number]
}

export type UpdateElementPayload<T extends NodePen.ElementType> = {
  id: string
  type: NodePen.ElementType
  data: Partial<NodePen.Element<T>['current']>
}

export type MoveElementPayload = {
  id: string
  position: [number, number]
}

export type UpdateSelectionPayload = {
  mode: 'set' | 'add' | 'remove'
} & (
  | {
      type: 'region'
      includeIntersection: boolean
      /** Coordinates in graph space. */
      region: {
        from: [x: number, y: number]
        to: [x: number, y: number]
      }
    }
  | {
      type: 'id'
      ids: string[]
    }
)

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

export type StartLiveWiresPayload = {
  templates: NodePen.Element<'wire'>['template'][]
  /** Where operation began. Only relevant to `transpose` actions. */
  origin: {
    elementId: string
    parameterId: string
  }
}

export type CaptureLiveWiresPayload = {
  /** Type of parameter attempting capture */
  type: 'input' | 'output'
  elementId: string
  parameterId: string
}
