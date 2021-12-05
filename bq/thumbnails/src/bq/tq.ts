import Queue from 'bee-queue'
import { ClientOpts } from 'redis'

const opts: ClientOpts = process.env.NP_DB_HOST
  ? {
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env?.NP_DB_PORT ?? '6379'),
    }
  : {}

const prefix = process.env?.NP_GLOBAL_PREFIX ?? 'dev'

console.log(`PREFIX: ${prefix}`)

const imageQueue = new Queue(`${prefix}:thumbnails:image`, {
  redis: opts,
  isWorker: true,
})

const videoQueue = new Queue(`${prefix}:thumbnails:video`, {
  redis: opts,
  isWorker: true,
})

const tq = {
  image: imageQueue,
  video: videoQueue,
}
