export const getExtents = (a: [number, number], b: [number, number]): [[number, number], [number, number]] => {
  const [ax, ay] = a
  const [bx, by] = b

  const [minX, maxX] = [Math.min(ax, bx), Math.max(ax, bx)]
  const [minY, maxY] = [Math.min(ay, by), Math.max(ay, by)]

  return [
    [minX, minY],
    [maxX, maxY],
  ]
}
