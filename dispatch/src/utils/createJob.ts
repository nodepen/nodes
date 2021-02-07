import { alpha } from '../queues'
import { AlphaJobArgs } from '../types'

export const createJob = async (
  queue: 'alpha',
  body: AlphaJobArgs
): Promise<{ id: string }> => {
  const job = await alpha.createJob(body).save()
  return { id: job.id }
}
