import type { Cursor } from '../../types'
import { useStore } from '$'

/** Composes correct cursor to display given all of current state. */
export const useCursorState = (): Cursor | null => {
  const wireEditCursor = useStore((state) => {
    const cursorInfo = state.registry.wires.live.cursor

    if (!cursorInfo) {
      return null
    }

    const { position, mode } = cursorInfo

    const cursor: Cursor = {
      configuration: {
        position,
      },
      context: {
        type: 'wire-edit',
        mode,
      },
    }

    return cursor
  })

  return wireEditCursor
}
