import Queue from 'bee-queue'
import { opts, prefix } from './config'
import * as imageHandlers from './image'

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

// Declare queue handlers
tq.image.process(imageHandlers.processJob)
tq.image.on('job succeeded', imageHandlers.onJobSucceeded)
tq.image.on('job failed', imageHandlers.onJobFailed)

export { tq }
