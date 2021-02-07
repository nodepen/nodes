import Queue, { Job } from 'bee-queue'
import { AlphaJobArgs } from 'AlphaJobArgs'

export const alpha = new Queue('alpha')

const run = async (job: Job<AlphaJobArgs>): Promise<string> => {
  console.log(`Starting job ${job.id}`)
  switch (job.data.type) {
    case 'config': {
      // Get config
      return 'Config or something'
    }
    case 'solution': {
      const { sessionId, solutionId, graph } = job.data

      // Store started_at at session:id:solution:id
      const start = Date.now()

      // Store json in redis

      // Request a ghx graph be created

      // Store ghx graph

      // Request a solution with the graph

      // Batch store solution items

      // Store finished_at and runtimeMessages at session:id:solution:id
      const end = Date.now()

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
  console.log(`Job ${job.id} succeeded! [${result}]`)

  switch (job.data.type) {
    case 'solution': {
      // Store status='succeeded' at session:id:solution:id
      const { sessionId, solutionId, graph } = job.data

      return
    }
    default: {
    }
  }
}

const failed = (job: Job<AlphaJobArgs>): void => {
  // Store status='failed' at session:id:solution:id

  console.log(`Job ${job.id} failed.`)
}

alpha.on('succeeded', succeeded)
alpha.on('failed', failed)

console.log('Alpha queue is ready')
