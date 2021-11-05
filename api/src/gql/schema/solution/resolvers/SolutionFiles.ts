import { db } from '../../../../redis'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'
import { authorize } from '../../../utils'

type ParentObject = {
  graphId: string
  solutionId: string
}

export const SolutionFiles: BaseResolverMap<
  ParentObject,
  Arguments['SolutionFiles']
> = {
  gh: async ({ graphId, solutionId }, _args, { user }): Promise<string> => {
    await authorize(user)

    return await db.get(`graph:${graphId}:solution:${solutionId}:gh`)
  },
  json: async ({ graphId, solutionId }): Promise<string> => {
    return await db.get(`graph:${graphId}:solution:${solutionId}:json`)
  },
}
