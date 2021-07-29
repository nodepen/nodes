import { NodePen } from 'glib'

export const getElementExtents = (
  element: NodePen.Element<NodePen.ElementType>
): [min: [number, number], max: [number, number]] => {
  const [x, y] = element.current.position
  const { width, height } = element.current.dimensions

  const [dx, dy] = [width / 2, height / 2]

  return [
    [x - dx, y - dy],
    [x + dx, y + dy],
  ]
}
