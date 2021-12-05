import Queue from 'bee-queue'
import { opts, prefix } from './config'
import * as thumbnailHandlers from './thumbnail'

console.log(`PREFIX: ${prefix}`)

const thumbnailQueue = new Queue(`${prefix}:render:thumbnail`, {
  redis: opts,
  isWorker: true,
})

const videoQueue = new Queue(`${prefix}:render:thumbnail-video`, {
  redis: opts,
  isWorker: true,
})

const rq = {
  thumbnail: thumbnailQueue,
  video: videoQueue,
}

// Declare queue handlers
rq.thumbnail.process(thumbnailHandlers.processJob)
rq.thumbnail.on('job succeeded', thumbnailHandlers.onJobSucceeded)
rq.thumbnail.on('job failed', thumbnailHandlers.onJobFailed)

export { rq }
