/** A rectangular region declared by its minimum and maximum extents. */
export type BoundingRegion = {
  min: {
    x: number
    y: number
  }
  max: {
    x: number
    y: number
  }
  left: number
  right: number
  top: number
  bottom: number
}
