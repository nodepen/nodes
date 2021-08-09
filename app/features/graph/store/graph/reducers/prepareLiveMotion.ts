import { GraphState } from '../types'
import { batchGetConnectedWires } from '../utils'

export const prepareLiveMotion = (state: GraphState, anchor: string, targets: string[]): void => {
  const [fromWires, toWires] = batchGetConnectedWires(state, targets)

  state.registry.move.fromWires = fromWires
  state.registry.move.toWires = toWires

  state.registry.move.elements = targets.filter((id) => id !== anchor)
}
