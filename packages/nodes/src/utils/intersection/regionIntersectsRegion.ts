import type { IntersectionRegion } from './types'
import { getRegionExtents } from './getRegionExtents'

/**
 * Test if two regions intersect
 */
export const regionIntersectsRegion = (a: IntersectionRegion, b: IntersectionRegion): boolean => {
  const aExtents = getRegionExtents(a)
  const bExtents = getRegionExtents(b)

  const tests = [
    aExtents.left < bExtents.right,
    aExtents.right > bExtents.left,
    aExtents.top > bExtents.bottom,
    aExtents.bottom < bExtents.top,
  ]

  return tests.every((pass) => !!pass)
}
