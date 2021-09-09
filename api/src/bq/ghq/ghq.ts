import Queue from 'bee-queue'
import { ClientOpts } from 'redis'

const opts: ClientOpts = process.env?.NP_DP_HOST
  ? {
      host: process.env?.NP_DB_HOST,
      port: Number.parseInt(process.env?.NP_DB_PORT),
    }
  : {}

const ghq = new Queue('gh', {
  redis: opts,
})

const processJob = async (
  job: Queue.Job<any>,
  done: Queue.DoneCallback<unknown>
): Promise<unknown> => {
  const { id } = job.data

  return done(null)
}

ghq.process(processJob)

ghq.on('job succeeded', (jobId, res) => {
  console.log('success')
})

ghq.on('job failed', (jobId, err) => {
  console.log('failure')
})

export { ghq }
