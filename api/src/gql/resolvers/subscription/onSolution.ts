import { withFilter } from 'graphql-subscriptions'
import { pubsub } from '../../pubsub'

export const onSolution = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('SOLUTION_COMPLETE'),
    (payload, variables) => {
      return variables.graphId
        ? variables.graphId === payload.onSolution.graphId
        : true
    }
  ),
}

// export const onSolution = {
//   subscribe: () => pubsub.asyncIterator('SOLUTION_COMPLETE'),
// }
