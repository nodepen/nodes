import { db } from '../../../db'

type GetGraphJsonArgs = {
  sessionId: string
  solutionId: string
}

export const getGraphJson = async (
  parent: never,
  args: GetGraphJsonArgs
): Promise<string> => {
  const { sessionId, solutionId } = args
  const key = `session:${sessionId}:graph:${solutionId}:json`

  return new Promise<string>((resolve, reject) => {
    db.get(key, (err, reply) => {
      if (err) {
        reject(err)
      }

      if (!reply) {
        reject('Graph key returned null result.')
      }

      resolve(reply)
    })
  })
}
