import { Server } from 'http'
import { initialize } from './gql'
import { admin } from './firebase'
import { db, initialize as initializePubsub } from './redis'
import { ghq } from './bq'

type GlobalServerConfig = {
  port: number
}

let pingInterval: ReturnType<typeof setInterval>

export const startup = async (): Promise<Server> => {
  // Initialize firebase dependencies
  const fb = admin.name
  console.log(`[ STARTUP ] Firebase project ${fb} initialized!`)

  // Initialize GraphQL dependencies
  const { server: api } = await initialize()
  console.log('[ STARTUP ] GraphQL server initialized!')

  // Wait for redis connection
  const initializeRedis = new Promise<void>((resolve, reject) => {
    db.client.on('connect', () => {
      console.log(`[ STARTUP ] Redis instance connected!`)

      // Ping redis instance to keep connection alive
      pingInterval = setInterval(() => {
        db.client.ping()
      }, 1000 * 15)

      resolve()
    })

    db.client.on('error', (err) => {
      clearInterval(pingInterval)
      console.error(err)
      reject(err)
    })
  })

  // // Wait for redis pubsub subscriptions to start
  // await initializePubsub()

  // Wait for gh solution queue connection
  const initializeQueue = new Promise<void>((resolve, reject) => {
    ghq.solve.on('ready', () => {
      console.log(`[ STARTUP ] Grasshopper solution queue connected!`)
      resolve()
    })

    ghq.solve.on('error', (err) => {
      reject(err)
    })
  })

  const redisConnectionResults = await Promise.allSettled([
    initializeRedis,
    initializeQueue,
  ])

  // Log any redis connection errors
  redisConnectionResults
    .filter((res): res is PromiseRejectedResult => res.status === 'rejected')
    .forEach((res: PromiseRejectedResult) =>
      console.log(`[ STARTUP ] [ ERROR ] ${res.reason}`)
    )

  return api
}
