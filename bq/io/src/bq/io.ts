import Queue from 'bee-queue'
import { opts, prefix } from './config'
import * as saveHandlers from './save'

console.log(`PREFIX: ${prefix}`)

const saveQueue = new Queue(`${prefix}:io:save`, {
  redis: opts,
  isWorker: true,
})

const io = {
  save: saveQueue,
}

// Declare queue handlers
io.save.process(saveHandlers.processJob)
io.save.on('job succeeded', saveHandlers.onJobSucceeded)
io.save.on('job failed', saveHandlers.onJobFailed)

export { io }
