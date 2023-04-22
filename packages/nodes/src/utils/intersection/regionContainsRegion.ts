import type { IntersectionRegion } from './types'
import { getRegionExtents } from './getRegionExtents'

/**
 * Test if container region fully contains target region.
 */
export const regionContainsRegion = (
  containerRegion: IntersectionRegion,
  targetRegion: IntersectionRegion
): boolean => {
  const container = getRegionExtents(containerRegion)
  const target = getRegionExtents(targetRegion)

  const tests = [
    target.right < container.right,
    target.left > container.left,
    target.top < container.top,
    target.bottom > container.bottom,
  ]

  return tests.every((pass) => !!pass)
}
