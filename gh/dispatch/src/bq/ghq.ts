import Queue from 'bee-queue'
import { ClientOpts } from 'redis'
import { NodePen } from 'glib'
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

    // await new Promise<void>((resolve) => {
    //   setTimeout(() => {
    //     resolve()
    //   }, 2000)
    // })

    const graphJson = await db.get(
      `graph:${graphId}:solution:${solutionId}:json`
    )

    // console.log({ graphJson })

    const { data: graphBinaries } = await axios.post(
      'http://localhost:9900/grasshopper/graph',
      graphJson
    )

    // console.log(graphBinaries)
    // Save base65 .gh file
    await db.setex(
      `graph:${graphId}:solution:${solutionId}:gh`,
      60 * 30,
      graphBinaries as string
    )

    const { data: graphSolution } = await axios.post(
      'http://localhost:9900/grasshopper/solve',
      graphBinaries
    )

    const { data, messages, timeout, duration } = graphSolution as any

    const writeAllValues = db.multi()

    for (const { elementId, parameterId, values } of data) {
      const key = `graph:${graphId}:solution:${solutionId}:${elementId}:${parameterId}`
      // console.log(values)
      writeAllValues.setex(key, 60 * 30, JSON.stringify(values))

      // for (const value of values) {
      //   console.log(value.data)
      // }
    }

    await new Promise<void>((resolve, reject) => {
      writeAllValues.exec((err: any) => {
        if (err) {
          console.log(err)
          reject(err)
          return
        }

        resolve()
      })
    })

    const elementCount = data.length

    // Basic usage logging - graphIds correspond to short-lived anonymous sessions
    await db.incrby('stat:total-ms', duration)
    await db.incrby('stat:total-runs', 1)
    await db.hincrby('stat:per-graph-ms', graphId, duration)
    await db.hincrby('stat:per-graph-runs', graphId, 1)

    return {
      ...job.data,
      duration,
      elementCount,
      runtimeMessages: messages ?? [],
      exceptionMessages: timeout ? ['Solution timed out.'] : undefined,
    }
  } catch (err) {
    console.error(err)
    console.log('Error!')

    return {
      ...job.data,
      duration: 0,
      elementCount: 0,
      exceptionMessages: ['Error during job processing!'],
    }
  }
}

ghq.process(processJob)

ghq.on('job succeeded', (jobId, res) => {
  const {
    graphId,
    solutionId,
    duration,
    elementCount,
    runtimeMessages,
    exceptionMessages,
  } = res

  const message = [
    `[ JOB ${jobId.padStart(4, '0')} ]`,
    '[ FINISH ]',
    `[ SOLUTION ]`,
    `\n  graphId    : ${graphId}`,
    `\n  solutionId : ${solutionId}`,
    `\n  duration   : ${duration}`,
    `\n  elements   : ${elementCount}`,
  ].join(' ')

  db.client.publish(
    'SOLUTION_FINISH',
    JSON.stringify({
      onSolutionFinish: {
        solutionId,
        duration,
        graphId,
        runtimeMessages,
        exceptionMessages,
      },
    })
  )

  console.log(message)
})

ghq.on('job failed', (jobId, err) => {
  console.log(err)
  console.log('failure')
})

export { ghq }
