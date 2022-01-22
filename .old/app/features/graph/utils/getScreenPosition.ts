import { DraggableEvent } from 'react-draggable'

export const getScreenPosition = (e: DraggableEvent): [number, number] => {
  switch (e.type) {
    case 'mouseup':
    case 'mouseend': {
      const { pageX, pageY } = e as MouseEvent
      return [pageX, pageY]
    }
    case 'touchend': {
      const { pageX, pageY } = (e as TouchEvent).changedTouches[0]
      return [pageX, pageY]
    }
    case 'pointerup': {
      const { pageX, pageY } = e as PointerEvent
      return [pageX, pageY]
    }
    default: {
      console.error('Failed to translate draggable event to page coordinates!')
      console.log(e)
      return [0, 0]
    }
  }
}
