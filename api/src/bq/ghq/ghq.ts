import Queue from 'bee-queue'
import { ClientOpts } from 'redis'

const opts: ClientOpts = process.env.NP_DB_HOST
  ? {
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env?.NP_DB_PORT),
    }
  : {}

const ghq = new Queue('gh', {
  redis: opts,
})

export { ghq }
