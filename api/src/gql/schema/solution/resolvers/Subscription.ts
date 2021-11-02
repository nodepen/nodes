import { withFilter } from 'graphql-subscriptions'
import { pubsub } from '../../../pubsub'

export const Subscription = {
  onSolutionStart: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('SOLUTION_START'),
      (payload, variables) => {
        console.log({ startPayload: payload })
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
  onUpdateSelection: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('UPDATE_SELECTION'),
      (payload, variables) => {
        console.log({ payload })
        console.log({ variables })
        return variables.graphId
          ? variables.graphId === payload.onUpdateSelection.graphId
          : true
      }
    ),
  },
}
