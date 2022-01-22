import Queue from 'bee-queue'
import { admin } from '../../firebase'

type SolutionMetricsJobData = {
  graphId: string
  solutionId: string
  user: {
    name: string
    id: string
  }
  duration: number
  elementCount: number
  started: string
  finished: string
  exceptionMessages?: string[]
}

export const processJob = async (
  job: Queue.Job<SolutionMetricsJobData>
): Promise<unknown> => {
  const {
    graphId,
    solutionId,
    user,
    duration,
    elementCount,
    started,
    finished,
    exceptionMessages,
  } = job.data

  const status = !!exceptionMessages ? 'FAILED' : 'SUCCEEDED'

  console.log(
    `[ JOB ${job.id.padStart(4, '0')} ] [ METRICS:SOLUTION ] [ START ]`
  )

  const db = admin.firestore()

  // Update solution record
  await db
    .collection('solutions')
    .doc(solutionId)
    .update(
      'time.started',
      started,
      'time.finished',
      finished,
      'stat.duration',
      duration,
      'stat.elements',
      elementCount,
      'status',
      status
    )

  // Update user usage
  const userRef = db.collection('users').doc(user.id)
  const userDoc = await userRef.get()

  if (userDoc.exists) {
    userRef.update(
      'usage.ms',
      (userDoc.get('usage.ms') ?? 0) + duration,
      'usage.n',
      (userDoc.get('usage.n') ?? 0) + 1
    )
  } else {
    console.log(user.name)
    console.log(user.id)
  }

  return {}
}
