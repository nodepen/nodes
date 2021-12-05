import { db } from '../../db'
import { rq } from '../rq'

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

  const thumbnailImageJob = await rq.thumbnail.createJob(result).save()

  console.log(
    `[ JOB ${thumbnailImageJob.id.padStart(
      4,
      '0'
    )} ] [ RQ:THUMBNAIL ] [ CREATE ]`
  )

  const thumbnailVideoJob = await rq.video.createJob(result).save()

  console.log(
    `[ JOB ${thumbnailVideoJob.id.padStart(
      4,
      '0'
    )} ] [ RQ:THUMBNAIL-VID ] [ CREATE ]`
  )
}
