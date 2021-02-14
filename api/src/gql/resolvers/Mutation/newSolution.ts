import axios from 'axios'
import { db } from '../../../db'
import { alpha } from '../../../queue'

export type AlphaJobArgs =
  | { type: 'config' }
  | {
      type: 'solution'
      sessionId: string
      solutionId: string
      graph: { [key: string]: any }
    }

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

  await addSolutionToSession(sessionId, solutionId)

  await addSolutionToQueueHistory(sessionId, solutionId)
  // const root = process.env.NP_DISPATCH_URL ?? 'http://localhost:4100'

  const job = await alpha
    .createJob<AlphaJobArgs>({
      type: 'solution',
      sessionId,
      solutionId,
      graph: elements,
    })
    .save()

  console.log(`[ JOB #${job.id} ]  [ CREATE ]  ${sessionId}:${solutionId}`)

  return JSON.stringify({ id: job.id })
}

const createSolutionStatus = async (
  sessionId: string,
  solutionId: string
): Promise<void> => {
  const key = `session:${sessionId}:graph:${solutionId}`

  return new Promise<void>((resolve, reject) => {
    db.hset(key, 'status', 'WAITING', (err, reply) => {
      resolve()
    })
  })
}

const addSolutionToSession = async (
  sessionId: string,
  solutionId: string
): Promise<void> => {
  const root = `session:${sessionId}`

  return new Promise<void>((resolve, reject) => {
    const batch = db.multi()

    batch.lpush(`${root}:history`, solutionId)

    batch.exec((err, res) => [resolve()])
  })
}

const addSolutionToQueueHistory = async (
  sessionId: string,
  solutionId: string
): Promise<void> => {
  const entry = `${sessionId};${solutionId}`

  return new Promise<void>((resolve, reject) => {
    const batch = db.multi()

    batch.lpush('queue:history', entry)
    batch.ltrim('queue:history', 0, 249)
    batch.hset('queue:meta', 'latest_created', new Date().toISOString())
    batch.hset('queue:active', entry, 'active')

    batch.exec((err, res) => resolve())
  })
}
