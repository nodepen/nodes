import { isAllTrue } from './isAllTrue'
import { regionExtents } from './regionExtents'
import { domainIntersects } from './domainIntersects'

export const regionIntersectsRegion = (
  container: [from: [number, number], to: [number, number]],
  target: [from: [number, number], to: [number, number]]
): boolean => {
  const outer = regionExtents(container[0], container[1])
  const inner = regionExtents(target[0], target[1])

  const tests = [
    domainIntersects([outer.min.x, outer.max.x], [inner.min.x, inner.max.x]),
    domainIntersects([outer.min.y, outer.max.y], [inner.min.y, inner.max.y]),
  ]

  return isAllTrue(tests)
}
