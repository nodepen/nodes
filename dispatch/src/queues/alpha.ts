import Queue, { Job } from 'bee-queue'

export const alpha = new Queue('alpha')

export type AlphaQueueJob = { type: 'config' }

const run = async (job: Job<AlphaQueueJob>): Promise<string> => {
  console.log(`Starting job ${job.id}`)
  switch (job.data.type) {
    case 'config': {
      // Get config
      return 'Config or something'
    }
    default: {
      throw new Error('Invalid job type in alpha queue.')
    }
  }
}

alpha.process(run)

const succeeded = (job: Job<string>, result: string): void => {
  console.log(`Job ${job.id} succeeded! [${result}]`)
}

alpha.on('succeeded', succeeded)
alpha.on('failed', () => {
  console.log('Job failed.')
})

console.log('Alpha is ready')
