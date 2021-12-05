import { db } from '../../db'
import { tq } from '../tq'

export const onJobSucceeded = async (
  jobId: string,
  result: any
): Promise<void> => {
  const {
    graphId,
    solutionId,
    revision,
    graphJson,
    graphBinaries,
    graphSolution,
  } = result

  console.log(`[ JOB ${jobId.padStart(4, '0')} ] [ SAVE ] [ FINISH ]`)

  db.client.publish('SAVE_READY', JSON.stringify(result))

  const job = await tq.image.createJob(result).save()

  console.log(`[ JOB ${job.id.padStart(4, '0')} ] [ TQ:IMAGE ] [ CREATE ]`)
}
