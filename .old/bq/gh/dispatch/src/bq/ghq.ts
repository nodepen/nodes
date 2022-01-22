import Queue from 'bee-queue'
import { opts, prefix } from './config'
import * as saveHandlers from './save'
import * as solveHandlers from './solve'

console.log(`PREFIX: ${prefix}`)

// Create queue connections
const solveQueue = new Queue(`${prefix}:gh:solve`, {
  redis: opts,
  isWorker: true,
})

const saveQueue = new Queue(`${prefix}:gh:save`, {
  redis: opts,
  isWorker: true,
})

const ghq = {
  save: saveQueue,
  solve: solveQueue,
}

// Declare queue handlers
ghq.save.process(saveHandlers.processJob)
ghq.save.on('job succeeded', saveHandlers.onJobSucceeded)
ghq.save.on('job failed', saveHandlers.onJobFailed)

ghq.solve.process(solveHandlers.processJob)
ghq.solve.on('job succeeded', solveHandlers.onJobSucceeded)
ghq.solve.on('job failed', solveHandlers.onJobFailed)

export { ghq }
