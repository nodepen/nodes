import redis from 'redis'
import * as handle from './handlers'

export const initialize = async (): Promise<void> => {
  const client = process.env.NP_DB_HOST
    ? redis.createClient({
        host: process.env.NP_DB_HOST,
        port: Number.parseInt(process.env.NP_DB_PORT),
      })
    : redis.createClient()

  client.on('message', (channel, message) => {
    switch (channel) {
      case 'SAVE_READY': {
        handle
          .saveReady(message)
          .then((graphId) => {
            console.log(`[ PUBSUB ] [ SAVE_READY ] [ SUCCEEDED ] ${graphId}`)
          })
          .catch((err) => {
            console.log(`[ PUBSUB ] [ SAVE_READY ] [ FAILED ]`)
            console.log(err)
          })
        break
      }
      default:
        console.log(`Did not know how to handle ${channel} message.`)
    }
  })

  return new Promise<void>((resolve) => {
    client.subscribe('SAVE_READY', (err, res) => {
      console.log('[ STARTUP ] Subscribed to redis `SAVE_READY` messages!')
      resolve()
    })
  })
}
