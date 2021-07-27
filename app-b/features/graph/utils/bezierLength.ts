import { distance } from './distance'

/** Borrowed with much gratitude from https://www.lemoda.net/maths/bezier-length/index.html ♥ */

type Point = {
  x: number
  y: number
}

type Bezier = {
  a: Point
  b: Point
  c: Point
  d: Point
}

export const bezierLength = (bezier: Bezier, samples = 100): number => {
  const { a, b, c, d } = bezier

  let length = 0
  let previous: Point = { x: 0, y: 0 }

  for (let i = 0; i < samples; i++) {
    const t = i / samples

    const x = bezierPoint(t, a.x, b.x, c.x, d.x)
    const y = bezierPoint(t, a.y, b.y, c.y, d.y)

    if (i == 0) {
      previous = { x, y }
      continue
    }

    length += distance([previous.x, previous.y], [x, y])
    previous = { x, y }
  }

  return length
}

/* eslint-disable */
const bezierPoint = (t: number, a: number, b: number, c: number, d: number): number => {
  return [
        a * (1 - t) * (1 - t) * (1 - t),
    3 * b * (1 - t) * (1 - t) * t,
    3 * c * (1 - t) * t       * t,
        d * t       * t       * t
  ].reduce((sum, value) => sum + value, 0)
}