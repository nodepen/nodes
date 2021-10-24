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

const processJob = async (
  job: Queue.Job<any>,
  done: Queue.DoneCallback<unknown>
): Promise<unknown> => {
  const { graphId, solutionId } = job.data

  return done(null, job.data)
}

ghq.process(processJob)

ghq.on('job succeeded', (jobId, res) => {
  const { graphId, solutionId } = res

  const message = [
    `[ JOB ${jobId.padStart(4, '0')} ]`,
    '[ FINISH ]',
    `[ SOLUTION ]`,
    `\n\tgraphId    : ${graphId}`,
    `\n\tsolutionId : ${solutionId}`,
  ].join(' ')

  console.log(message)
})

ghq.on('job failed', (jobId, err) => {
  console.log(err)
  console.log('failure')
})

export { ghq }
