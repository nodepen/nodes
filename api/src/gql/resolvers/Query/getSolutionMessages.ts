import { db } from '../../../db'

type GetSolutionMessagesArgs = {
  sessionId: string
  solutionId: string
}

export const getSolutionMessages = (
  parent: never,
  args: GetSolutionMessagesArgs
): Promise<string> => {
  const { sessionId, solutionId } = args
  const key = `session:${sessionId}:graph:${solutionId}:solution`

  return new Promise<string>((resolve, reject) => {
    db.hget(key, 'messages', (err, reply) => {
      if (err) {
        reject(err)
      }

      resolve(reply ?? '[]')
    })
  })
}
