import { NodePen, assert } from 'glib'
import { GraphState, Payload } from '../types'

export const updateLiveElement = (
  state: GraphState,
  payload: Payload.UpdateElementPayload<NodePen.ElementType>
): void => {
  const { id, type, data } = payload

  const element = state.elements[id]

  // Make sure element exists
  if (!element) {
    console.log(`🐍 Attempted to update an element that doesn't exist!`)
    return
  }

  // Make sure element is of same type as incoming data
  switch (type) {
    case 'region': {
      if (!assert.element.isRegion(element)) {
        console.log(`🐍 Attempted to update a(n) ${element.template.type} with region data!`)
        return
      }

      const current = data as NodePen.Element<'region'>['current']

      element.current = { ...element.current, ...current }
      break
    }
    case 'wire': {
      if (!assert.element.isWire(element)) {
        console.log(`🐍 Attempted to update a(n) ${element.template.type} with wire data!`)
      }

      const current = data as NodePen.Element<'wire'>['current']

      element.current = { ...element.current, ...current }
      break
    }
    default: {
      console.log(`Update logic for ${type} elements not yet implemented. `)
      return
    }
  }
}
