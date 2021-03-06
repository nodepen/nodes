import { GraphStore } from '../types'

export const initial: GraphStore = {
  elements: {},
  camera: {
    position: [0, 0],
  },
  config: {
    executionMode: 'immediate',
  },
  overlay: {},
  solution: {},
  selected: [],
  library: {
    params: {},
    maths: {},
    sets: {},
    vector: {},
    curve: {},
    transform: {},
  },
  ready: true,
  preflight: {
    getLibrary: false,
    getSession: false,
  },
} as GraphStore
