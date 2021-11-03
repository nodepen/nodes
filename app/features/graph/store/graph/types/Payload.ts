import { GrasshopperGraphManifest } from '@/features/graph/types'
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
  mode: 'default' | 'add' | 'remove' | 'toggle'
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

export type PrepareLiveMotionPayload = {
  /**
   * The id of the element the user is currently moving directly.
   * @Remarks This element will be excluded from `dispatchLiveMotion` on the assumption that it is a `Draggable` element.
   */
  anchor: string
  /**
   * The ids of all elements that will be involved in the move. (i.e. selection)
   * @remarks This is used to identify attached elements and wires, so the anchor element must be specified here if it should be included.
   */
  targets: string[]
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
  adjustment?: [dx: number, dy: number]
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

export type RestoreGraphPayload = {
  manifest: GrasshopperGraphManifest
  expireSolution: boolean
}

export type ToggleVisibilityPayload = {
  ids: string[]
}

export type SetVisibilityPayload = {
  ids: string[]
  visibility: 'visible' | 'hidden'
}
