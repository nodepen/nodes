import { withFilter } from 'graphql-subscriptions'
import { pubsub } from '../../../pubsub'

export const Subscription = {
  onSolution: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('SOLUTION_COMPLETE'),
      (payload, variables) => {
        return variables.graphId
          ? variables.graphId === payload.onSolution.graphId
          : true
      }
    ),
  },
}
