import { authorize } from '../../../../gql/utils'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'
import { db } from '../../../../redis'

export const Query: BaseResolverMap<never, Arguments['Query']> = {
  restore: async (_parent, args, { user }) => {
    await authorize(user)

    const graphId = await db.get(`user:${user.id}:graph`)
    const solutionId = await db.get(`graph:${graphId}:solution`)
    const graphJson = await db.get(
      `graph:${graphId}:solution:${solutionId}:json`
    )

    return { graphJson, graphId, solutionId }
  },
  solution: (_parent, args, { user }) => {
    const { graphId, solutionId } = args

    // Fetch manifest and such when needed

    return { graphId, solutionId }
  },
}
