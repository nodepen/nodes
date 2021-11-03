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
  onUpdateSelection: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('UPDATE_SELECTION'),
      (payload, variables) => {
        return variables.graphId
          ? variables.graphId === payload.onUpdateSelection.graphId
          : true
      }
    ),
  },
  onUpdateVisibility: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('UPDATE_VISIBILITY'),
      (payload, variables) => {
        return variables.graphId
          ? variables.graphId === payload.onUpdateVisibility.graphId
          : true
      }
    ),
  },
}
