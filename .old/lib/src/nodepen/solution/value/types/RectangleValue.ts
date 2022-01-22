import { Point3d } from './shared'

export type RectangleValue = {
  width: number
  height: number
  corners: {
    a: Point3d,
    b: Point3d,
    c: Point3d,
    d: Point3d
  }
}