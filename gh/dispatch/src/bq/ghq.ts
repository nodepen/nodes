import Queue from 'bee-queue'
import { ClientOpts } from 'redis'
import { db } from '../db'
import axios from 'axios'

const opts: ClientOpts = process.env.NP_DB_HOST
  ? {
      host: process.env.NP_DB_HOST,
      port: Number.parseInt(process.env?.NP_DB_PORT),
    }
  : {}

const ghq = new Queue('gh', {
  redis: opts,
  isWorker: true,
})

const processJob = async (job: Queue.Job<any>): Promise<unknown> => {
  try {
    const { graphId, solutionId } = job.data

    const graphJson = await db.get(
      `graph:${graphId}:solution:${solutionId}:json`
    )

    // console.log({ graphJson })

    const { data: graphGhx } = await axios.post(
      'http://localhost:9900/grasshopper/graph',
      graphJson
    )

    // console.log(graphGhx)

    const { data: graphSolution } = await axios.post(
      'http://localhost:9900/grasshopper/solve',
      graphGhx
    )

    const { data, messages, timeout } = graphSolution as any

    // for (const { elementId, parameterId, values } of data) {
    //   console.log(`${elementId} : ${parameterId}`)
    //   for (const value of values) {
    //     console.log(value)
    //   }
    // }

    // console.log(messages)

    return {
      ...job.data,
      runtimeMessages: messages ?? [],
      exceptionMessages: timeout ? ['Solution timed out.'] : undefined,
    }
  } catch (err) {
    // console.error(err)
    console.log('Error!')

    return { ...job.data, exceptionMessages: ['Error during job processing!'] }
  }
}

ghq.process(processJob)

ghq.on('job succeeded', (jobId, res) => {
  const { graphId, solutionId, runtimeMessages, exceptionMessages } = res

  const message = [
    `[ JOB ${jobId.padStart(4, '0')} ]`,
    '[ FINISH ]',
    `[ SOLUTION ]`,
    `\n\tgraphId    : ${graphId}`,
    `\n\tsolutionId : ${solutionId}`,
  ].join(' ')

  db.client.publish(
    'SOLUTION_COMPLETE',
    JSON.stringify({
      onSolution: { solutionId, graphId, runtimeMessages, exceptionMessages },
    })
  )

  console.log(message)
})

ghq.on('job failed', (jobId, err) => {
  console.log(err)
  console.log('failure')
})

export { ghq }