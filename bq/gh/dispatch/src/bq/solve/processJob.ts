import Queue from 'bee-queue'
import axios from 'axios'
import { db } from '../../db'

type SolveQueueJobData = {
  graphId: string
  solutionId: string
  user: {
    name: string
    id: string
  }
  time: {
    scheduled: string
  }
}

const GH_HOST = process.env?.NP_GH_HOST ?? 'localhost'
const GH_PORT = process.env?.NP_GH_PORT ?? 9900

export const processJob = async (
  job: Queue.Job<SolveQueueJobData>
): Promise<unknown> => {
  const started = new Date().toISOString()

  try {
    const { graphId, solutionId } = job.data

    const key = `graph:${graphId}:solution:${solutionId}`

    const graphJson = await db.get(`${key}:json`)

    const { data: graphBinaries } = await axios.post<string>(
      `http://${GH_HOST}:${GH_PORT}/grasshopper/graph`,
      graphJson
    )

    await db.setex(`${key}:gh`, 60 * 15, graphBinaries)

    const { data: graphSolution } = await axios.post(
      `http://${GH_HOST}:${GH_PORT}/grasshopper/solve`,
      graphBinaries
    )

    // TODO: Type solution response values
    const { data, messages, timeout, duration } = graphSolution as any

    console.log({ graphSolution })

    const writeAllValues = db.multi()

    for (const { elementId, parameterId, values } of data) {
      const key = `graph:${graphId}:solution:${solutionId}:${elementId}:${parameterId}`
      // console.log(values)
      writeAllValues.setex(key, 60 * 15, JSON.stringify(values))

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
      started,
      finished: new Date().toISOString(),
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
      started,
      finished: new Date().toISOString(),
      exceptionMessages: ['Error during job processing!'],
    }
  }
}
