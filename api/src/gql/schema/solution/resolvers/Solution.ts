import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

type ParentObject = {
  graphId: string
  solutionId: string
}

export const Solution: BaseResolverMap<ParentObject, Arguments['Solution']> = {
  value: ({ graphId, solutionId }, { elementId, parameterId }) => {
    // Query the value!

    return { type: 'a-type', value: 'a-value' }
  },
}
