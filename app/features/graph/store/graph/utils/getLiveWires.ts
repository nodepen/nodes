import { GraphState, LiveWireElement } from '../types'

export const getLiveWires = (state: GraphState): LiveWireElement[] => {
  return Object.values(state.elements).filter(
    (element): element is LiveWireElement => element.template.type === 'wire' && element.template.mode === 'live'
  )
}
