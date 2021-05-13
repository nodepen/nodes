import { db } from '../../../db'

type GetSolutionValueArgs = {
  sessionId: string
  solutionId: string
  elementId: string
  parameterId: string
}

type SolutionValue = {
  solutionId: string
  elementId: string
  parameterId: string
  data: string
}

export const getSolutionValue = async (
  parent: never,
  args: GetSolutionValueArgs
): Promise<SolutionValue> => {
  const { sessionId, solutionId, elementId, parameterId } = args
  const key = `session:${sessionId}:graph:${solutionId}:solution:${elementId}:${parameterId}`

  return new Promise<SolutionValue>((resolve, reject) => {
    db.get(key, (err, reply) => {
      if (err || !reply) {
        reject(err ?? 'No solution found.')
      }

      const response: SolutionValue = {
        solutionId,
        elementId,
        parameterId,
        data: reply,
      }

      db.del(key, (err, reply) => {
        resolve(response)
      })
    })
  })
}
