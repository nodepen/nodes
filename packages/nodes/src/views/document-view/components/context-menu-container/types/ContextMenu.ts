import type { ContextMenuContext } from './ContextMenuContext'

export type ContextMenu = {
    position: {
        x: number
        y: number
    }
    context: ContextMenuContext
}