export const distance3d = (a: [number, number, number], b: [number, number, number]): number => {
  const [ax, ay, az] = a
  const [bx, by, bz] = b

  return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2) + Math.pow(bz - az, 2))
}
