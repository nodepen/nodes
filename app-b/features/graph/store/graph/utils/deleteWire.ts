import { assert } from 'glib'
import { GraphState } from '../types'

/**
 * Delete the specified wire and remove any relevant sources
 * @param state
 * @param id
 */
export const deleteWire = (state: GraphState, id: string): void => {
  const wire = state.elements[id]

  if (!assert.element.isWire(wire)) {
    return
  }

  if (wire.template.mode === 'live') {
    return
  }

  const { from, to } = wire.template

  const toElement = state.elements[to.elementId]

  if (!toElement || !assert.element.isGraphElement(toElement.current)) {
    return
  }

  // Filter out source
  toElement.current.sources[to.parameterId] = toElement.current.sources[to.parameterId].filter(
    (source) => source.elementInstanceId !== from.elementId && source.parameterInstanceId !== from.parameterId
  )

  // Delete wire element
  delete state.elements[id]
}
