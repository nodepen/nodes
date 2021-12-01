import Queue from 'bee-queue'
import { ClientOpts } from 'redis'

const opts: ClientOpts = process.env.NP_DB_HOST
  ? {
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env?.NP_DB_PORT),
    }
  : {}

const prefix = process.env?.NP_GLOBAL_PREFIX ?? 'dev'

console.log(`PREFIX: ${prefix}`)

const solveQueue = new Queue(`${prefix}:gh:solve`, {
  redis: opts,
  isWorker: false,
})

const saveQueue = new Queue(`${prefix}:gh:save`, {
  redis: opts,
  isWorker: false,
})

const ghq = {
  save: saveQueue,
  solve: solveQueue,
}

ghq.solve.checkStalledJobs(5000)
ghq.save.checkStalledJobs(5000)

export { ghq }
