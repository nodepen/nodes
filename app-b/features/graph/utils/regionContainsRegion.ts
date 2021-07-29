import { isAllTrue } from './isAllTrue'
import { regionExtents } from './regionExtents'
import { domainContains } from './domainContains'

export const regionContainsRegion = (
  container: [from: [number, number], to: [number, number]],
  target: [from: [number, number], to: [number, number]]
): boolean => {
  const outer = regionExtents(container[0], container[1])
  const inner = regionExtents(target[0], target[1])

  const tests = [
    domainContains([outer.min.x, outer.max.x], inner.min.x),
    domainContains([outer.min.x, outer.max.x], inner.max.x),
    domainContains([outer.min.y, outer.max.y], inner.min.y),
    domainContains([outer.min.y, outer.max.y], inner.min.y),
  ]

  return isAllTrue(tests)
}
