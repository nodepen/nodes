import Queue from 'bee-queue'
import { opts, prefix } from './config'

const imageQueue = new Queue(`${prefix}:thumbnails:image`, {
  redis: opts,
  isWorker: false,
})

// const videoQueue = new Queue(`${prefix}:thumbnails:video`, {
//   redis: opts,
//   isWorker: false,
// })

export const tq = {
  image: imageQueue,
  // video: videoQueue,
}
