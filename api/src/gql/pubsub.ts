import { RedisPubSub } from 'graphql-redis-subscriptions'
import redis from 'ioredis'

const options = process.env.NP_DB_HOST
  ? {
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env.NP_DB_PORT),
    }
  : {}

/**
 * The pubsub instance used to both publish api events and subscribe to them in Apollo `subscription` queries.
 */
export const pubsub = new RedisPubSub({
  subscriber: new redis(options),
  publisher: new redis(options),
})
