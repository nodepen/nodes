import { db } from '../../../../redis'

type ParentData = {
  graphId: string
  solutionId: string
}

export const SolutionFiles = {
  gh: async ({ graphId, solutionId }: ParentData): Promise<string> => {
    try {
      return await db.get(`graph:${graphId}:solution:${solutionId}:gh`)
    } catch {
      return undefined
    }
  },
}
