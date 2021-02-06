import { alpha } from '../queues'

export const createJob = async (
  queue: 'alpha',
  body: any
): Promise<{ id: string }> => {
  const job = await alpha.createJob(body).save()
  return { id: job.id }
}
