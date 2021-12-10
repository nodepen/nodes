import { db } from '../../db'

export const onJobSucceeded = async (
  jobId: string,
  result: any
): Promise<void> => {
  const { graphId, solutionId } = result

  console.log(`[ JOB ${jobId.padStart(4, '0')} ] [ IO:SAVE ] [ SUCCEEDED ]`)

  console.log(`${graphId} ${solutionId}`)

  db.client.publish(
    'SAVE_FINISH',
    JSON.stringify({
      onSaveFinish: {
        solutionId,
        graphId,
      },
    })
  )
}
