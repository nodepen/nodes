import { db } from '../../../../redis'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

type ParentObject = {
  graphId: string
  solutionId: string
}

export const Solution: BaseResolverMap<ParentObject, Arguments['Solution']> = {
  value: async ({ graphId, solutionId }, { elementId, parameterId }) => {
    try {
      const result = await db.get(
        `graph:${graphId}:solution:${solutionId}:${elementId}:${parameterId}`
      )

      const tree = JSON.parse(result)

      console.log(tree)

      return tree
    } catch (err) {
      console.log(err)
    }
    // Query the value!

    return { type: 'a-type', value: 'a-value' }
  },
}
