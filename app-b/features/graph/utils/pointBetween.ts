/**
 * Given two points, return a point some parameter along the segment between them.
 */
export const pointBetween = (a: [number, number], b: [number, number], t: number): { x: number; y: number } => {
  const [ax, ay] = a
  const [bx, by] = b

  const [vx, vy] = [bx - ax, by - ay]

  const [dx, dy] = [vx * t, vy * t]

  return { x: ax + dx, y: ay + dy }
}
