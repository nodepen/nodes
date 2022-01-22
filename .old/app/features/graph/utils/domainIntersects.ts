export const domainIntersects = (a: [number, number], b: [number, number]): boolean => {
  const [min, max] = [...a].sort()

  return b.filter((value) => value > min && value < max).length === 1
}
