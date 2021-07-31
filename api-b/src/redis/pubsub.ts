import redis, { RedisClient } from 'redis'
import { pubsub } from '../gql/pubsub'

export const initialize = (client: RedisClient): void => {
  client.subscribe('SOLUTION_COMPLETE')

  client.on('message', (channel, message) => {
    console.log(`Message from ${channel}: ${message} `)
  })

  setInterval(() => {
    pubsub.publish('SOLUTION_COMPLETE', {
      onSolution: { solutionId: Date.now().toString() },
    })
  }, 1000)
}
