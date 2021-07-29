import { NodePen } from 'glib'

export const getElementExtents = (
  element: NodePen.Element<NodePen.ElementType>
): [min: [number, number], max: [number, number]] => {
  const [x, y] = element.current.position
  const { width, height } = element.current.dimensions

  return [
    [x, y],
    [x + width, y + height],
  ]
}
