import { withFilter } from 'graphql-subscriptions'
import { pubsub } from '../../pubsub'

export const onSolution = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('SOLUTION_COMPLETE'),
    (payload, variables) => {
      return variables.solutionId
        ? variables.solutionId === payload.onSolution.solutionId
        : true
    }
  ),
}
