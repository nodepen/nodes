import { GraphStore } from '../types'

export const initial: GraphStore = {
  elements: {},
  library: {
    params: {},
    maths: {},
    sets: {},
    vector: {},
    curve: {},
    transform: {}
  },
  ready: false,
  preflight: {
    getLibrary: false,
    getSession: false
  }
} as GraphStore