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

const ghq = new Queue(`${prefix}:gh`, {
  redis: opts,
  isWorker: false,
})

ghq.checkStalledJobs(5000)

export { ghq }
