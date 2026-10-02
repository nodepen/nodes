/** A rectangular region that can start and end at any two corner positions. */
export type IntersectionRegion = {
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
}
