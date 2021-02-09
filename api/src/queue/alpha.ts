import Queue from 'bee-queue'

export const alpha = process.env.NP_DB_HOST
  ? new Queue('alpha', {
      redis: {
        host: process.env.NP_DB_HOST,
      },
      isWorker: false,
    })
  : new Queue('alpha', {
      isWorker: false,
    })
