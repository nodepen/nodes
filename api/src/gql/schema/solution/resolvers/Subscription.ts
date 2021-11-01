import { withFilter } from 'graphql-subscriptions'
import { pubsub } from '../../../pubsub'

export const Subscription = {
  onSolutionStart: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('SOLUTION_START'),
      (payload, variables) => {
        return variables.graphId
          ? variables.graphId === payload.onSolutionStart.graphId
          : true
      }
    ),
  },
  onSolutionFinish: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('SOLUTION_FINISH'),
      (payload, variables) => {
        return variables.graphId
          ? variables.graphId === payload.onSolutionFinish.graphId
          : true
      }
    ),
  },
}
