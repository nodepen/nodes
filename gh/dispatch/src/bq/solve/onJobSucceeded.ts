import { db } from '../../db'

export const onJobSucceeded = (jobId: string, result: any): void => {
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
    '[ FINISH ]',
    `[ SOLUTION ]`,
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
}
