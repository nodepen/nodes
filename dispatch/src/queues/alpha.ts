import Queue, { Job } from 'bee-queue'
import axios from 'axios'
import { Glasshopper } from 'glib'
import { AlphaJobArgs } from 'AlphaJobArgs'
import { db } from '../server'
import dotenv from 'dotenv'

dotenv.config()

export const alpha = process.env.NP_DB_HOST
  ? new Queue('alpha', {
      redis: {
        host: process.env.NP_DB_HOST,
      },
    })
  : new Queue('alpha')

const COMPUTE = process.env.NP_COMPUTE_URL ?? 'http://localhost:9900'

console.log(`COMPUTE ${COMPUTE}`)

type GrasshopperResult = {
  elementId: string
  parameterId: string
  values: GrasshopperResultValue[]
}

type GrasshopperResultValue = {
  path: number[]
  data: {
    value: string
    type: string
  }[]
}

const run = async (job: Job<AlphaJobArgs>): Promise<string> => {
  switch (job.data.type) {
    case 'config': {
      // Get config
      return 'Config or something'
    }
    case 'solution': {
      const { sessionId, solutionId, graph } = job.data
      const solutionKey = `session:${sessionId}:graph:${solutionId}`

      console.log(`[ JOB #${job.id} ]  [ START ]  ${sessionId}:${solutionId}`)

      // Remove job from waiting
      await db.hdel('queue:active', `${sessionId};${solutionId}`)

      // Increment job number
      await db.hset('queue:meta', 'total_count', job.id)

      // Store started_at at session:id:solution:id
      const start = Date.now()
      db.hset(solutionKey, 'started_at', new Date(start).toISOString())

      // Store json in redis
      const jsonkey = `${solutionKey}:json`
      await db.set(jsonkey, JSON.stringify(graph))

      // Request a ghx graph be created
      const validTypes = [
        'static-component',
        'static-parameter',
        'number-slider',
      ]
      const elements = Object.values(graph).filter((el) =>
        validTypes.includes(el.template.type)
      )

      const { data: ghx } = await axios.post(
        `${COMPUTE}/grasshopper/graph`,
        JSON.stringify(elements),
        { headers: { 'Content-Type': 'text/plain; charset=UTF-8' } }
      )

      // Store ghx graph
      const ghxkey = `${solutionKey}:ghx`
      db.set(ghxkey, ghx)

      // Request a solution with the graph
      const { data: solution } = await axios.post(
        `${COMPUTE}/grasshopper/solve`,
        ghx
      )

      // Store finished_at at session:id:solution:id
      const end = Date.now()

      const duration = end - start
      console.log(`${sessionId}:${solutionId} completed in ${duration}ms`)

      db.hset(
        solutionKey,
        'finished_at',
        new Date(end).toISOString(),
        'duration',
        duration.toString()
      )

      // Store solution stats and messages
      const { data: results, messages, timeout } = solution

      if (timeout) {
        // Solution took longer than allowed time
        await db.hset(solutionKey, 'status', 'TIMEOUT')

        console.log(`[ JOB #${job.id} ]  [ TIMEOUT ]`)

        throw new Error('Timeout')
      }

      console.log(
        `[ JOB #${job.id} ]  [ SOLUTION ]  ${results.length} parameters in ${duration}ms`
      )

      await db.hset(
        `${solutionKey}:solution`,
        'messages',
        JSON.stringify(messages),
        'duration',
        duration.toString()
      )

      // Batch store solution items
      const writeSolution = db.multi()

      results.forEach(
        ({ elementId, parameterId, values }: GrasshopperResult) => {
          const key = `${solutionKey}:solution:${elementId}:${parameterId}`
          const tree = resultsToDataTree(values)

          writeSolution.set(key, JSON.stringify(tree))
        }
      )

      await new Promise<void>((resolve, reject) => {
        writeSolution.exec((error, reply) => {
          if (error) {
            reject(error)
          }
          resolve()
        })
      })

      // Return status 'success'
      return 'success'
    }
    default: {
      throw new Error('Invalid job type in alpha queue.')
    }
  }
}

alpha.process(run)

const succeeded = (job: Job<AlphaJobArgs>, result: string): void => {
  console.log(`[ JOB #${job.id} ]  [ SUCCEEDED ]`)
  switch (job.data.type) {
    case 'solution': {
      // Store status='succeeded' at session:id:solution:id
      const { sessionId, solutionId, graph } = job.data
      const key = `session:${sessionId}:graph:${solutionId}`

      db.hset(key, 'status', 'SUCCEEDED')

      return
    }
  }
}

const failed = async (job: Job<AlphaJobArgs>): Promise<void> => {
  // Check for timeout

  switch (job.data.type) {
    case 'solution': {
      const { sessionId, solutionId, graph } = job.data
      const key = `session:${sessionId}:graph:${solutionId}`

      const result = await db.hget(key, 'status')

      if (result.toString() === 'TIMEOUT') {
        return
      }

      console.log(`[ JOB #${job.id} ]  [ FAILED ]`)
      db.hset(key, 'status', 'FAILED')

      return
    }
  }
}

alpha.on('succeeded', succeeded)
alpha.on('failed', failed)

const resultsToDataTree = (
  results: GrasshopperResultValue[]
): Glasshopper.Data.DataTree => {
  const tree: Glasshopper.Data.DataTree = {}

  results.forEach(({ path, data }) => {
    const branch = `{${path.join(';')}}`
    const values = data.map(({ value, type }) => {
      switch (type) {
        case 'point': {
          const { X: x, Y: y, Z: z } = JSON.parse(value)
          const point: Glasshopper.Data.DataTreeValue<'point'> = {
            from: 'solution',
            type: 'point',
            data: {
              x,
              y,
              z,
            },
          }
          return point
        }
        case 'number': {
          const number: Glasshopper.Data.DataTreeValue<'number'> = {
            from: 'solution',
            type: 'number',
            data: Number.parseFloat(value),
          }
          return number
        }
        case 'integer': {
          const integer: Glasshopper.Data.DataTreeValue<'integer'> = {
            from: 'solution',
            type: 'integer',
            data: Number.parseInt(value),
          }
          return integer
        }
        case 'curve': {
          const curve: Glasshopper.Data.DataTreeValue<'curve'> = {
            from: 'solution',
            type: 'curve',
            data: JSON.parse(value),
          }
          return curve
        }
        case 'line': {
          const line: Glasshopper.Data.DataTreeValue<'line'> = {
            from: 'solution',
            type: 'line',
            data: JSON.parse(value),
          }
          return line
        }
        default: {
          console.log(`Using default parse for type ${type}.`)
          const v = {
            from: 'solution',
            type: type,
            data: JSON.stringify(value),
          } as Glasshopper.Data.DataTreeValue<'string'>
          return v
        }
      }
    })

    tree[branch] = values
  })

  return tree
}
