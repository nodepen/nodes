import { db } from '../../db'
import { io } from '../io'

export const onJobSucceeded = async (
  jobId: string,
  result: any
): Promise<void> => {
  const {
    graphId,
    solutionId,
    duration,
    elementCount,
    runtimeMessages,
    exceptionMessages,
  } = result

  const message = [
    `[ JOB ${jobId.padStart(4, '0')} ]`,
    '[ SOLVE ]',
    `[ FINISH ]`,
    `\n  graphId    : ${graphId}`,
    `\n  solutionId : ${solutionId}`,
    `\n  duration   : ${duration}`,
    `\n  elements   : ${elementCount}`,
  ].join(' ')

  db.client.publish(
    'SOLUTION_FINISH',
    JSON.stringify({
      onSolutionFinish: {
        solutionId,
        duration,
        graphId,
        runtimeMessages,
        exceptionMessages,
      },
    })
  )

  console.log(message)

  console.log(result)

  const metricsJob = await io.solutionMetrics.createJob(result).save()

  console.log(
    `[ JOB ${metricsJob.id.padStart(
      4,
      '0'
    )} ] [ METRIC:SOLUTION ] [ SCHEDULED ]`
  )
}
