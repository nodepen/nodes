import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

export const Query: BaseResolverMap<never, Arguments['Query']> = {
  solution: (_parent, args, { user }) => {
    const { graphId, solutionId } = args

    // Fetch manifest and such when needed

    return { graphId, solutionId }
  },
}
