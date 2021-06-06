export const distance = (a: [number, number], b: [number, number]): number => {
  const [ax, ay] = a
  const [bx, by] = b

  return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2))
}
