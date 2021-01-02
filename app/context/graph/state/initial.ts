import { GraphStore } from '../types'

export const initial: GraphStore = {
  library: {
    params: {},
    maths: {},
    sets: {},
    vector: {},
    curve: {},
    transform: {}
  },
  ready: false
} as GraphStore