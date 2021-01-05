import { getExtents } from './getExtents'

describe('given an arbitrary region', () => {
  it('returns correct extents', () => {
    const [min, max] = getExtents([5, 7], [1, 2])

    expect(min[0]).toEqual(1)
  })
})
