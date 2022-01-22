// For now, most curve types are sent as their bezier anchors
export type BezierApproximation = {
  degree: number
  segments: [
    ax: number,
    ay: number,
    az: number,
    ix: number,
    iy: number,
    iz: number,
    jx: number,
    jy: number,
    jz: number,
    bx: number,
    by: number,
    bz: number
  ][]
}