export const pointAt = (
  start: [x: number, y: number],
  end: [x: number, y: number],
  t: number
): { x: number; y: number } => {
  const [ax, ay] = start
  const [bx, by] = end

  const [vx, vy] = [bx - ax, by - ay]

  const [dx, dy] = [vx * t, vy * t]

  return { x: ax + dx, y: ay + dy }
}
