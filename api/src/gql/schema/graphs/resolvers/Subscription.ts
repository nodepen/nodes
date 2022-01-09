import { withFilter } from 'graphql-subscriptions'
import { pubsub } from '../../../pubsub'

export const Subscription = {
  onSaveFinish: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('SAVE_FINISH'),
      (payload, variables) => {
        return variables.graphId === payload.onSaveFinish.graphId
      }
    ),
  },
}
