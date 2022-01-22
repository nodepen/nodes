import express, { Express } from 'express'
import { ghq } from './bq'
import { db } from './db'

export const startup = async (): Promise<Express> => {
  const port = 9800

  const app = express()

  app.get('/', (_, res) => {
    res.send('Ready to run')
  })

  app.listen(port, () => {
    console.log(`Dispatch listening on port ${port} !`)
  })

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

  return app
}
