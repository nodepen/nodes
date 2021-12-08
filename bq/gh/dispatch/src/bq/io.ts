import Queue from 'bee-queue'
import { opts, prefix } from './config'

const saveQueue = new Queue(`${prefix}:io:save`, {
  redis: opts,
  isWorker: true,
})

export const io = {
  save: saveQueue,
}
