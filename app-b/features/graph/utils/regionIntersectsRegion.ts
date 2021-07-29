import { regionExtents } from './regionExtents'
import { domainIntersects } from './domainIntersects'
import { domainContains } from './domainContains'

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

  // Short-circuit if trivial case detected
  if (tests.every((test) => test)) {
    return true
  }

  if (tests.every((test) => !test)) {
    return false
  }

  // If only one domain intersects, the other must be contained by the region
  const [xIntersects, yIntersects] = tests

  if (xIntersects && domainContains([outer.min.y, outer.max.y], [inner.min.y, inner.max.y])) {
    return true
  }

  if (yIntersects && domainContains([outer.min.x, outer.max.x], [inner.min.x, inner.max.x])) {
    return true
  }

  return false
}
