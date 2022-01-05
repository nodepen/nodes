import express, { Express } from 'express'
import { admin } from './firebase'
import { io } from './bq'

export const startup = async (): Promise<Express> => {
  // Initialize local healthcheck server
  const app = express()

  app.get('/', (_, res) => {
    res.send('Howdy, from I/O queue worker!')
  })

  // Initialize firebase dependencies
  const fb = admin.name
  console.log(`[ STARTUP ] Firebase project ${fb} initialized!`)

  // Wait for queue connections
  await new Promise<void>((resolve, reject) => {
    io.save.on('ready', () => {
      console.log('[ STARTUP ] NodePen I/O queue connected!')
      resolve()
    })

    io.save.on('error', (err) => {
      reject(err)
    })
  })

  return app
}
