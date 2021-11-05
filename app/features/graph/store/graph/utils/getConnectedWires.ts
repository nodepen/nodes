import { GraphState } from '../types'
import { getConnectedWires as getWires } from '@/features/graph/utils'

export const getConnectedWires = (
  state: GraphState,
  elementId: string,
  parameterId?: string
): [fromWires: string[], toWires: string[]] => {
  return getWires(Object.values(state.elements), elementId, parameterId)
}
