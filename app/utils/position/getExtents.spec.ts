import { getExtents } from './getExtents'

describe('given an arbitrary region', () => {
  const [min, max] = getExtents([5, 7], [1, 2])

  it('returns correct minimum', () => {
    const [x, y] = min

    expect(x).toEqual(1)
    expect(y).toEqual(2)
  })

  it('returns correct maximum', () => {
    const [x, y] = max

    expect(x).toEqual(5)
    expect(y).toEqual(7)
  })
})
