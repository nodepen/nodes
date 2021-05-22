import redis from 'redis'
import { promisify } from 'util'

// Initialize client
const client = process.env.NP_DB_HOST
  ? redis.createClient({
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env.NP_DB_PORT),
    })
  : redis.createClient()

// Promisify redis commands
const delAsync = promisify(client.del)
const del = delAsync.bind(client) as typeof delAsync

const expireAsync = promisify(client.expire)
const expire = expireAsync.bind(client) as typeof expireAsync

const getAsync = promisify(client.get)
const get = getAsync.bind(client) as typeof getAsync

const hgetAsync = promisify(client.hget)
const hget = hgetAsync.bind(client) as typeof hgetAsync

const hgetallAsync = promisify(client.hgetall)
const hgetall = hgetallAsync.bind(client) as typeof hgetallAsync

const hsetAsync = promisify(client.hset)
const hset = hsetAsync.bind(client) as typeof hsetAsync

const setAsync = promisify(client.set)
const set = setAsync.bind(client) as typeof setAsync

const setexAsync = promisify(client.setex)
const setex = setexAsync.bind(client) as typeof setexAsync

// Export db object
export const db = {
  del,
  expire,
  get,
  hget,
  hgetall,
  hset,
  set,
  setex,
}
