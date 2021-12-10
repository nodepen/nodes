import { withFilter } from 'graphql-subscriptions'
import { pubsub } from '../../../pubsub'

export const Subscription = {
  onSaveFinish: {
    subscribe: withFilter(
      () => pubsub.asyncIterator('SAVE_FINISH'),
      (payload, variables) => {
        console.log({ payload })
        console.log({ variables })
        return variables.graphId
          ? variables.graphId === payload.onSaveFinish.graphId
          : true
      }
    ),
  },
}
