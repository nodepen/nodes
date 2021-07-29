import { GraphState } from '../types'
import { batchGetConnectedWires } from '../utils'

export const prepareLiveMotion = (state: GraphState, targets: string[]): void => {
  const [fromWires, toWires] = batchGetConnectedWires(state, targets)

  state.registry.move.fromWires = fromWires
  state.registry.move.toWires = toWires
  state.registry.move.elements = targets
}
