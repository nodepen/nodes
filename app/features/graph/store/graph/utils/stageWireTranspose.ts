import { isInputOrOutput } from '@/features/graph/utils'
import { NodePen } from 'glib'
import { GraphState } from '../types'
import { getConnectedWires } from './getConnectedWires'

/**
 * Given an origin parameter reference, return templates for all live wires involved in a transpose.
 * @param state
 * @param elementId
 * @param parameterId
 */
export const stageWireTranspose = (
  state: GraphState,
  elementId: string,
  parameterId: string,
  pointerId: number
): NodePen.Element<'wire'>['template'][] => {
  const [existingFromWires, existingToWires] = getConnectedWires(state, elementId, parameterId)

  const originElement = state.elements[elementId]

  const mode = isInputOrOutput(originElement, parameterId)

  if (!mode) {
    console.log('🐍🐍🐍 Attempted to stage a transpose for a parameter that was neither an input or an output.')
    return []
  }

  const existingWires = [...existingFromWires, ...existingToWires].map(
    (wireId) => state.elements[wireId] as NodePen.Element<'wire'>
  )

  const templates = existingWires.map((wire) => {
    const ends: any =
      mode === 'input' ? { from: wire.template.from, to: undefined } : { from: undefined, to: wire.template.to }

    const template: NodePen.Element<'wire'>['template'] = {
      type: 'wire',
      mode: 'live',
      initial: {
        pointer: pointerId,
        mode: 'default',
      },
      transpose: true,
      ...ends,
    }

    return template
  })

  return templates
}
