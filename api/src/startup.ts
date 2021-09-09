import { Server } from 'http'
import { initialize } from './gql'
import { admin } from './firebase'
import { db } from './redis'
import { ghq } from './bq'

type GlobalServerConfig = {
  port: number
}

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
      resolve()
    })

    db.client.on('error', (err) => {
      reject(err)
    })
  })

  // Wait for gh solution queue connection
  const initializeQueue = new Promise<void>((resolve, reject) => {
    ghq.on('ready', () => {
      console.log(`[ STARTUP ] Grasshopper solution queue connected!`)
      resolve()
    })

    ghq.on('error', (err) => {
      reject(err)
    })
  })

  await Promise.all([initializeRedis, initializeQueue])

  return api
}
