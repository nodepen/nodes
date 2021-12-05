import Queue from 'bee-queue'
import { opts, prefix } from './config'

const thumbnailQueue = new Queue(`${prefix}:render:thumbnail`, {
  redis: opts,
  isWorker: false,
})

// const videoQueue = new Queue(`${prefix}:thumbnails:video`, {
//   redis: opts,
//   isWorker: false,
// })

export const rq = {
  thumbnail: thumbnailQueue,
}
