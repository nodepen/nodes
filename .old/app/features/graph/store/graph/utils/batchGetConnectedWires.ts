import { NodePen } from 'glib'
import { GraphState } from '../types'

export const batchGetConnectedWires = (
  state: GraphState,
  elementIds: string[]
): [fromWires: string[], toWires: string[]] => {
  const [fromWires, toWires] = [[], []] as [string[], string[]]

  const wires = Object.values(state.elements).filter(
    (element): element is NodePen.Element<'wire'> => element.template.type === 'wire'
  )

  wires.forEach((wire) => {
    const { from, to } = wire.template

    if (from && elementIds.includes(from.elementId)) {
      fromWires.push(wire.id)
    }

    if (to && elementIds.includes(to.elementId)) {
      toWires.push(wire.id)
    }
  })

  return [fromWires, toWires]
}
