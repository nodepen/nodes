import { Server } from 'http'
import { initialize } from './gql'
import { admin } from './firebase'
import { db } from './redis'

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
  return new Promise<Server>((resolve, reject) => {
    db.client.on('connect', () => {
      console.log(`[ STARTUP ] Redis instance connected!`)
      resolve(api)
    })

    db.client.on('error', (err) => {
      reject(err)
    })
  })
}
