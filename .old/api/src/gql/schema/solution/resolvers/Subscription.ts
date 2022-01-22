import { withFilter } from 'graphql-subscriptions'
import { pubsub } from '../../../pubsub'

export const Subscription = {
  onSolutionStart: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('SOLUTION_START'),
      (payload, variables) => {
        return variables.graphId === payload.onSolutionStart.graphId
      }
    ),
  },
  onSolutionFinish: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('SOLUTION_FINISH'),
      (payload, variables) => {
        return variables.graphId === payload.onSolutionFinish.graphId
      }
    ),
  },
  onUpdateSelection: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('UPDATE_SELECTION'),
      (payload, variables) => {
        return variables.graphId === payload.onUpdateSelection.graphId
      }
    ),
  },
  onUpdateVisibility: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('UPDATE_VISIBILITY'),
      (payload, variables) => {
        return variables.graphId === payload.onUpdateVisibility.graphId
      }
    ),
  },
}
