/* eslint-disable */

/** All curve geometry is delivered to NodePen as a degree 3 bezier approximation. */
export type CurveValue = [
  number, number, number,   // [x,  y,  z ] segment start point
  number, number, number,   // [ax, ay, az] first control point
  number, number, number,   // [ix, iy, iz] second control point
  number, number, number,   // [i,  j,  k ] segment end point
][]
