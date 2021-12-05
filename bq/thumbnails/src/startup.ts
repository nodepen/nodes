import express, { Express } from 'express'
import { admin } from './firebase'
import { tq } from './bq'

export const startup = async (): Promise<Express> => {
  // Initialize local healthcheck server
  const app = express()

  app.get('/', (_, res) => {
    res.send('howdy from thumbnails queue worker')
  })

  // Initialize firebase dependencies
  const fb = admin.name
  console.log(`[ STARTUP ] Firebase project ${fb} initialized!`)

  // Wait for queue connections
  await new Promise<void>((resolve, reject) => {
    tq.image.on('ready', () => {
      console.log('[ STARTUP ] Thumbnail image queue connected!')
      resolve()
    })

    tq.image.on('error', (err) => {
      reject(err)
    })
  })

  return app
}
