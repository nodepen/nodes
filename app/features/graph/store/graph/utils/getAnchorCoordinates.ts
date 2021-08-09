import { assert } from 'glib'
import { GraphState } from '../types'

export const getAnchorCoordinates = (
  state: GraphState,
  elementId: string,
  anchorId: string
): [x: number, y: number] => {
  const element = state.elements[elementId]

  if (!element) {
    throw new Error('Element does not exist.')
  }

  if (!assert.element.isGripElement(element.current)) {
    throw new Error('Element does not have anchors.')
  }

  if (!element.current.anchors[anchorId]) {
    throw new Error('Anchor does not exist.')
  }

  const [x, y] = element.current.position
  const [dx, dy] = element.current.anchors[anchorId]

  return [x + dx, y + dy]
}
