import { RedisPubSub } from 'graphql-redis-subscriptions'
import { db } from '../redis'
import redis from 'ioredis'

const options = process.env.NP_DB_HOST
  ? {
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env.NP_DB_PORT),
    }
  : {}

export const pubsub = new RedisPubSub({
  subscriber: new redis(options),
  publisher: new redis(options),
})
