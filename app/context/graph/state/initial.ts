import { GraphStore } from '../types'

export const initial: GraphStore = {
  elements: {},
  registry: {
    wires: {
      to: {},
      from: {},
    },
  },
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
  ready: false,
  preflight: {
    getLibrary: false,
    getSession: false,
  },
} as GraphStore
