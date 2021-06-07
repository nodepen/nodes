import { NodePen } from 'glib'

/** Given a collection of wires and a target element, return wires that are `from` and `to` the target element. */
export const findAttachedWires = (
  elements: NodePen.Element<'wire'>[],
  target: string
): [from: string[], to: string[]] => {
  return elements.reduce(
    ([currentFrom, currentTo], wire) => {
      const from = wire.template.from.elementId === target ? [...currentFrom, wire.id] : currentFrom
      const to = wire.template.to.elementId === target ? [...currentTo, wire.id] : currentTo

      return [from, to]
    },
    [[], []] as [string[], string[]]
  )
}
