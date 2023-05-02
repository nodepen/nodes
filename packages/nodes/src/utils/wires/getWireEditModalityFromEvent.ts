import type { WireEditMode } from '@/types'

type ValidEvent = Pick<PointerEvent | KeyboardEvent, 'altKey' | 'shiftKey' | 'ctrlKey'>

export const getWireEditModalityFromEvent = (e: ValidEvent): WireEditMode => {
  if (e.ctrlKey && e.shiftKey) {
    return 'move'
  }

  if (e.shiftKey) {
    return 'merge'
  }

  if (e.ctrlKey) {
    return 'remove'
  }

  return 'set'
}
