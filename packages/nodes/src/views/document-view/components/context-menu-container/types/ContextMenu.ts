import type { ContextMenuContext } from './ContextMenuContext'

export type ContextMenu = {
  /** Position in overlay space. */
  position: {
    x: number
    y: number
  }
  context: ContextMenuContext
}
