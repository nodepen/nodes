import Queue from 'bee-queue'
import { opts, prefix } from './config'

const saveQueue = new Queue(`${prefix}:io:save`, {
  redis: opts,
  isWorker: false,
})

const solutionMetricsQueue = new Queue(`${prefix}:io:metric:solution`, {
  redis: opts,
  isWorker: false,
})

export const io = {
  save: saveQueue,
  solutionMetrics: solutionMetricsQueue,
}
