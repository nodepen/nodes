import type { Cursor } from '../../types'
import { useStore } from '$'

/** Composes correct cursor to display given all of current state. */
export const useCursorState = (): Cursor | null => {
  const wireEditCursor = useStore((state) => {
    const cursorInfo = state.registry.wires.live.cursor

    if (!cursorInfo) {
      return null
    }

    if (!state.registry.wires.live.mode) {
      console.log('🐍 Tried to generate wire edit cursor without a `mode` set!')
      return null
    }

    const { position } = cursorInfo

    const cursor: Cursor = {
      configuration: {
        position,
      },
      context: {
        type: 'wire-edit',
        mode: state.registry.wires.live.mode,
      },
    }

    return cursor
  })

  return wireEditCursor
}
