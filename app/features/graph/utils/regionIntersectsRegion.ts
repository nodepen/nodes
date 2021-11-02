import { regionExtents } from './regionExtents'

export const regionIntersectsRegion = (
  container: [from: [number, number], to: [number, number]],
  target: [from: [number, number], to: [number, number]]
): boolean => {
  const a = regionExtents(container[0], container[1])
  const b = regionExtents(target[0], target[1])

  const tests = [a.min.x < b.max.x, a.max.x > b.min.x, a.min.y < b.max.y, a.max.y > b.min.y]

  return tests.every((pass) => pass)
}
