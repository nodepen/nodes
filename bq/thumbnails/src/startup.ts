import express, { Express } from 'express'
import { tq } from './bq'

export const startup = async (port: number): Promise<Express> => {
  const app = express()

  app.get('/', (_, res) => {
    res.send('howdy from thumbnails queue worker')
  })

  // Wait for queue connections

  // Wait for firebase app

  return app
}
