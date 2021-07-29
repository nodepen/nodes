import { assert } from 'glib'
import { GraphState } from '../types'

export const getConnectedWires = (
  state: GraphState,
  elementId: string,
  parameterId?: string
): [fromWires: string[], toWires: string[]] => {
  const [fromWires, toWires] = [[], []] as [string[], string[]]

  const wires = Object.values(state.elements).filter((element) => element.template.type === 'wire')

  wires.forEach((wire) => {
    if (!assert.element.isWire(wire)) {
      return
    }

    const { from, to } = wire.template

    if (from?.elementId === elementId) {
      if (parameterId && from?.parameterId === parameterId) {
        fromWires.push(wire.id)
      } else {
        fromWires.push(wire.id)
      }
    }

    if (to?.elementId === elementId && to?.parameterId === parameterId) {
      if (parameterId && to?.parameterId === parameterId) {
        toWires.push(wire.id)
      } else {
        toWires.push(wire.id)
      }
    }
  })

  return [fromWires, toWires]
}
