import redis from 'redis'
import asyncRedis from 'async-redis'
import dotenv from 'dotenv'
import { alpha } from './queues'

dotenv.config()

const syncdb = process.env.NP_DB_HOST
  ? redis.createClient({
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env.NP_DB_PORT),
    })
  : redis.createClient()

export const db = asyncRedis.decorate(syncdb)

alpha.on('error', (err) => {
  console.error(err)
})
