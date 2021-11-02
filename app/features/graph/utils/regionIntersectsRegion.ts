import { regionExtents } from './regionExtents'
import { domainIntersects } from './domainIntersects'
import { domainContains } from './domainContains'

export const regionIntersectsRegion = (
  container: [from: [number, number], to: [number, number]],
  target: [from: [number, number], to: [number, number]]
): boolean => {
  const outer = regionExtents(container[0], container[1])
  const inner = regionExtents(target[0], target[1])

  const intersectionTests = [
    domainIntersects([outer.min.x, outer.max.x], [inner.min.x, inner.max.x]),
    domainIntersects([outer.min.y, outer.max.y], [inner.min.y, inner.max.y]),
  ]

  // Short-circuit if trivial case detected
  if (intersectionTests.every((test) => test)) {
    return true
  }

  const containmentTests = [
    domainContains([outer.min.x, outer.max.x], [inner.min.x, inner.max.x]),
    domainContains([outer.min.y, outer.max.y], [inner.min.y, inner.max.y]),
    domainContains([inner.min.x, inner.max.x], [outer.min.x, outer.max.x]),
    domainContains([inner.min.y, inner.max.y], [outer.min.y, outer.max.y]),
  ]

  const [xIntersects, yIntersects] = intersectionTests
  const [xContainsTarget, yContainsTarget, xWithinTarget, yWithinTarget] = containmentTests

  // If only one domain intersects, the other must be contained by the region or contain the region
  if (xIntersects && (yWithinTarget || yContainsTarget)) {
    return true
  }

  if (yIntersects && (xWithinTarget || xContainsTarget)) {
    return true
  }

  // console.log({ xIntersects, yIntersects })
  // console.log({ xContainsTarget, yContainsTarget, xWithinTarget, yWithinTarget })

  // If only one domain contains the target, then the other domain must be contained by the target
  if (xContainsTarget && yWithinTarget) {
    return true
  }

  if (yContainsTarget && xWithinTarget) {
    return true
  }

  return false
}
