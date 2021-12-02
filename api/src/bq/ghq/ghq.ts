import Queue from 'bee-queue'
import { ClientOpts } from 'redis'
import * as storeHandlers from './store'

const opts: ClientOpts = process.env.NP_DB_HOST
  ? {
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env?.NP_DB_PORT),
    }
  : {}

const prefix = process.env?.NP_GLOBAL_PREFIX ?? 'dev'

console.log(`PREFIX: ${prefix}`)

// Create queue connections
const solveQueue = new Queue(`${prefix}:gh:solve`, {
  redis: opts,
  isWorker: false,
})

const saveQueue = new Queue(`${prefix}:gh:save`, {
  redis: opts,
  isWorker: false,
})

const storeQueue = new Queue(`${prefix}:gh:store`, {
  redis: opts,
  isWorker: true,
})

const ghq = {
  save: saveQueue,
  solve: solveQueue,
  store: storeQueue,
}

// Declare queue handlers
ghq.store.process(storeHandlers.processJob)

ghq.solve.checkStalledJobs(5000)
ghq.save.checkStalledJobs(5000)
ghq.store.checkStalledJobs(5000)

export { ghq }
