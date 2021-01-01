import { GraphStore } from './GraphStore'

export type GraphContext = {
  store: GraphStore
  dispatch: {
    doSomething: () => void
  }
}