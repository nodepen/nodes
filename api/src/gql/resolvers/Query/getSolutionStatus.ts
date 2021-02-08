import { db } from '../../../db'

type GetSolutionStatusArgs = {
  sessionId: string
  solutionId: string
}

type SolutionStatus = {
  status: string
  started_at?: string
  finished_at?: string
}

export const getSolutionStatus = (
  parent: never,
  args: GetSolutionStatusArgs
): Promise<SolutionStatus> => {
  const { sessionId, solutionId } = args
  const key = `session:${sessionId}:graph:${solutionId}`

  return new Promise<SolutionStatus>((resolve, reject) => {
    db.hgetall(key, (err, reply) => {
      if (err) {
        reject(err)
      }

      resolve(reply as SolutionStatus)
    })
  })
}
