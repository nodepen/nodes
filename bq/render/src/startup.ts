import express, { Express } from 'express'
import { admin } from './firebase'
import { rq } from './bq'

export const startup = async (): Promise<Express> => {
  // Initialize local healthcheck server
  const app = express()

  app.get('/', (_, res) => {
    res.send('Howdy, from render queue worker!')
  })

  // Initialize firebase dependencies
  const fb = admin.name
  console.log(`[ STARTUP ] Firebase project ${fb} initialized!`)

  // Wait for queue connections
  await new Promise<void>((resolve, reject) => {
    rq.thumbnail.on('ready', () => {
      console.log('[ STARTUP ] Render image queue connected!')
      resolve()
    })

    rq.thumbnail.on('error', (err) => {
      reject(err)
    })
  })

  return app
}
