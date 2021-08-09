type Extents = {
  min: {
    x: number
    y: number
  }
  max: {
    x: number
    y: number
  }
}

export const regionExtents = (from: [number, number], to: [number, number]): Extents => {
  const [ax, ay] = from
  const [bx, by] = to

  const extents: Extents = {
    min: {
      x: Math.min(ax, bx),
      y: Math.min(ay, by),
    },
    max: {
      x: Math.max(ax, bx),
      y: Math.max(ay, by),
    },
  }

  return extents
}
