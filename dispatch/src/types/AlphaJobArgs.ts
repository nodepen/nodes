import { Glasshopper } from 'glib'

export type AlphaJobArgs =
  | { type: 'config' }
  | {
      type: 'solution'
      sessionId: string
      solutionId: string
      graph: { [key: string]: any }
    }
