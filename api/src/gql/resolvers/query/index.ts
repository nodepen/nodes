import { getInstalledComponents } from './getInstalledComponents'
import { solution } from './solution'

export const Query = {
  getInstalledComponents,
  solution: (_parent: never, { graphId, solutionId }: any, context: any) => {
    // What do I have enough info to find?
    // { manifest, graphs }

    return { graphId, solutionId }
  },
}
