import type { Point3d } from './Point3d'

export type Plane = {
  origin: Point3d
  axis: {
    x: Point3d
    y: Point3d
    z: Point3d
  }
}
