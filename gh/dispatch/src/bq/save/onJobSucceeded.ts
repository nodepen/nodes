import { ghq } from '../ghq'
import { db } from '../../db'

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
}
