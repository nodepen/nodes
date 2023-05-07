import type { WireEditMode } from '@/types'

export type Cursor = {
  configuration: CursorConfiguration
  context: CursorContext
}

export type CursorConfiguration = {
  /** Current cursor position in page space. */
  position: {
    x: number
    y: number
  }
}

export type CursorContext = WireEditCursorContext

export type WireEditCursorContext = {
  type: 'wire-edit'
  mode: WireEditMode
  target?: {
    nodeInstanceId: string
    portInstanceId: string
    portDirection: 'input' | 'output'
  }
}
