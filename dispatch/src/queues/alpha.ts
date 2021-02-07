import Queue, { Job } from 'bee-queue'
import axios from 'axios'
import { AlphaJobArgs } from 'AlphaJobArgs'
import { db } from '../server'

export const alpha = new Queue('alpha')

const COMPUTE = process.env.NP_COMPUTE_URL ?? 'http://localhost:8081'

const run = async (job: Job<AlphaJobArgs>): Promise<string> => {
  console.log(`Starting job ${job.id}`)
  switch (job.data.type) {
    case 'config': {
      // Get config
      return 'Config or something'
    }
    case 'solution': {
      const { sessionId, solutionId, graph } = job.data
      const solutionKey = `session:${sessionId}:graph:${solutionId}`

      // Store started_at at session:id:solution:id
      const start = Date.now()
      db.hset(solutionKey, 'started_at', new Date(start).toISOString())

      // Store json in redis
      const jsonkey = `${solutionKey}:json`
      db.set(jsonkey, JSON.stringify(graph))

      // Request a ghx graph be created
      const elements = Object.values(graph).filter(
        (el) =>
          el.template.type === 'static-component' ||
          el.template.type === 'static-parameter'
      )

      const { data: ghx } = await axios.post(
        `${COMPUTE}/grasshopper/graph`,
        elements
      )

      console.log(ghx)

      // Store ghx graph
      const ghxkey = `${solutionKey}:ghx`
      db.set(ghxkey, ghx)

      // Request a solution with the graph
      const { data: solution } = await axios.post(
        `${COMPUTE}/grasshopper/solve`,
        ghx
      )
      console.log(solution)

      // Store solution stats and messages

      // Batch store solution items

      // Store finished_at and runtimeMessages at session:id:solution:id
      const end = Date.now()
      db.hset(solutionKey, 'finished_at', new Date(end).toISOString())

      console.log(`${sessionId}:${solutionId} succeeded in ${end - start}ms`)

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
  switch (job.data.type) {
    case 'solution': {
      // Store status='succeeded' at session:id:solution:id
      const { sessionId, solutionId, graph } = job.data
      const key = `session:${sessionId}:graph:${solutionId}`

      console.log(
        `Job ${job.id} (${sessionId}:${solutionId}) succeeded! [${result}]`
      )

      db.hset(key, 'status', 'SUCCEEDED')

      return
    }
    default: {
      console.log(`Job ${job.id} succeeded! [${result}]`)
    }
  }
}

const failed = (job: Job<AlphaJobArgs>): void => {
  // Store status='failed' at session:id:solution:id
  switch (job.data.type) {
    case 'solution': {
      const { sessionId, solutionId, graph } = job.data
      const key = `session:${sessionId}:graph:${solutionId}`

      console.log(`Job ${job.id} (${sessionId}:${solutionId}) failed!`)

      db.hset(key, 'status', 'FAILED')

      return
    }
    default: {
      console.log(`Job ${job.id} failed.`)
    }
  }
}

alpha.on('succeeded', succeeded)
alpha.on('failed', failed)

console.log('Alpha queue is ready')
