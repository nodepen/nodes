import { GraphStore } from '../types'

export const initial: GraphStore = {
  elements: {},
  registry: {
    move: {
      elements: [],
      fromWires: [],
      toWires: [],
    },
  },
  activeKeys: [],
  camera: {
    position: [0, 0],
  },
  config: {
    executionMode: 'immediate',
  },
  overlay: {},
  solution: {
    status: 'SUCCEEDED',
    duration: 0,
  },
  selected: [],
  library: {
    params: {},
    maths: {},
    sets: {},
    vector: {},
    curve: {},
    mesh: {},
    intersect: {},
    transform: {},
  },
  ready: false,
  preflight: {
    getLibrary: false,
    getSession: false,
  },
} as GraphStore
