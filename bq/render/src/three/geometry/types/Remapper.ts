/**
 * A collection of functions for mapping world coordinates to render camera coordinates.
 */
export type Remapper = {
  x: (n: number) => number
  y: (n: number) => number
  z: (n: number) => number
}
