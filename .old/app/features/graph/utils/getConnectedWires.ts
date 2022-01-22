import { NodePen, assert } from 'glib'

export const getConnectedWires = (
  elements: NodePen.Element<NodePen.ElementType>[],
  elementId: string,
  parameterId?: string
): [fromWires: string[], toWires: string[]] => {
  const [fromWires, toWires] = [[], []] as [string[], string[]]

  const wires = elements.filter((element) => element.template.type === 'wire')

  wires.forEach((wire) => {
    if (!assert.element.isWire(wire)) {
      return
    }

    const { from, to } = wire.template

    if (from?.elementId === elementId) {
      if (!parameterId) {
        fromWires.push(wire.id)
      }

      if (from.parameterId === parameterId) {
        fromWires.push(wire.id)
      }
    }

    if (to?.elementId === elementId) {
      if (!parameterId) {
        toWires.push(wire.id)
      }

      if (to.parameterId === parameterId) {
        toWires.push(wire.id)
      }
    }
  })

  return [fromWires, toWires]
}
