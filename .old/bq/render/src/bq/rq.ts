import Queue from 'bee-queue'
import { opts, prefix } from './config'
import * as thumbnailHandlers from './thumbnail'
import * as thumbnailVideoHandlers from './thumbnail-video'

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

rq.video.process(thumbnailVideoHandlers.processJob)
rq.video.on('job succeeded', thumbnailVideoHandlers.onJobSucceeded)
rq.video.on('job failed', thumbnailVideoHandlers.onJobFailed)

export { rq }
