import Queue from 'bee-queue'
import { opts, prefix } from './config'
import * as saveHandlers from './save'
import * as solutionMetricsHandlers from './solutionMetrics'

console.log(`PREFIX: ${prefix}`)

const saveQueue = new Queue(`${prefix}:io:save`, {
  redis: opts,
  isWorker: true,
})

const solutionMetricsQueue = new Queue(`${prefix}:io:metric:solution`, {
  redis: opts,
  isWorker: true,
})

const io = {
  save: saveQueue,
  solutionMetrics: solutionMetricsQueue,
}

// Declare queue handlers
io.save.process(saveHandlers.processJob)
io.save.on('job succeeded', saveHandlers.onJobSucceeded)
io.save.on('job failed', saveHandlers.onJobFailed)

io.solutionMetrics.process(solutionMetricsHandlers.processJob)
io.solutionMetrics.on('job succeeded', solutionMetricsHandlers.onJobSucceeded)
io.solutionMetrics.on('job failed', solutionMetricsHandlers.onJobFailed)

export { io }
