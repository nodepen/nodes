import type { BoundingRegion, IntersectionRegion } from './types'

export const getRegionExtents = (region: IntersectionRegion): BoundingRegion => {
  const { from, to } = region

  const corners = {
    min: {
      x: Math.min(from.x, to.x),
      y: Math.min(from.y, to.y),
    },
    max: {
      x: Math.max(from.x, to.x),
      y: Math.max(from.y, to.y),
    },
  }

  return {
    min: corners.min,
    max: corners.max,
    left: corners.min.x,
    right: corners.max.x,
    top: corners.max.y,
    bottom: corners.min.y,
  }
}
