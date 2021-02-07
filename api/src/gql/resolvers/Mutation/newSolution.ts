import axios from 'axios'
import { db } from '../../../db'

type NewSolutionArgs = {
  sessionId: string
  solutionId: string
  graph: string
}

export const newSolution = async (
  parent: never,
  args: NewSolutionArgs
): Promise<string> => {
  const { sessionId, solutionId, graph } = args
  const elements = JSON.parse(graph)

  await createSolutionStatus(sessionId, solutionId)

  const { data } = await axios.post(
    process.env.NP_DISPATCH_URL ?? 'http://localhost:4100/new/solution',
    { sessionId, solutionId, graph: elements }
  )

  return JSON.stringify(data)
}

const createSolutionStatus = async (
  sessionId: string,
  solutionId: string
): Promise<void> => {
  const key = `session:${sessionId}:solution:${solutionId}`

  return new Promise<void>((resolve, reject) => {
    db.hset(key, { status: 'WAITING' }, (err, reply) => {
      resolve()
    })
  })
}
