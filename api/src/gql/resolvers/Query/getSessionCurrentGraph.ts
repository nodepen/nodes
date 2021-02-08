import { db } from '../../../db'

type GetSessionGraphArgs = {
  sessionId: string
}

export const getSessionCurrentGraph = async (
  parent: never,
  args: GetSessionGraphArgs
): Promise<string> => {
  const { sessionId } = args

  const solutionId = await getSessionCurrentGraphId(sessionId)

  if (!solutionId) {
    return '[]'
  }

  const graph = await getSessionGraphElements(sessionId, solutionId)

  return graph ?? '[]'
}

const getSessionCurrentGraphId = async (id: string): Promise<string | null> => {
  const key = `session:${id}:history`

  return new Promise<string | null>((resolve, reject) => {
    db.lrange(key, 0, 0, (err, reply) => {
      if (err) {
        reject(err)
      }

      resolve(reply?.[0] ?? null)
    })
  })
}

const getSessionGraphElements = async (
  sessionId: string,
  solutionId: string
): Promise<string | null> => {
  const key = `session:${sessionId}:graph:${solutionId}:json`

  return new Promise<string | null>((resolve, reject) => {
    db.get(key, (err, reply) => {
      if (err) {
        reject(err)
      }

      resolve(reply)
    })
  })
}
