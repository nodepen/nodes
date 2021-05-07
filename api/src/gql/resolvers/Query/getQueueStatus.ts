import { db } from '../../../db'

type GetQueueStatusArgs = {
  depth: number
}

type QueueStatus = {
  jobs: string[]
  active_count: number
  total_count: string
  session_count: number
  latest_created: string
}

export const getQueueStatus = async (
  parent: never,
  args: GetQueueStatusArgs
): Promise<QueueStatus> => {
  const { depth } = args

  const result: Partial<QueueStatus> = {}

  return new Promise<QueueStatus>((resolve, reject) => {
    db.lrange('queue:history', 0, depth > 0 ? depth - 1 : 0, (err, reply) => {
      if (err) {
        reject(err)
      }

      result.jobs = reply

      db.hlen('queue:active', (err, reply) => {
        if (err) {
          reject(err)
        }

        result.active_count = reply

        db.hget('queue:meta', 'latest_created', (err, reply) => {
          if (err) {
            reject(err)
          }

          result.latest_created = reply

          db.hget('queue:meta', 'total_count', (err, reply) => {
            if (err) {
              reject(err)
            }

            result.total_count = reply

            db.hlen('queue:sessions', (err, reply) => {
              if (err) {
                reject(err)
              }

              result.session_count = reply

              resolve(result as QueueStatus)
            })
          })
        })
      })
    })
  })
}
