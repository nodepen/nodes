import { db } from '../../../redis'
import { ghq } from '../../../bq'
import { RequestContext } from '../../types'
import { authorize } from '../../utils/authorize'

type ScheduleSolutionArgs = {
  context: {
    solutionId: string
    graphId: string
    graphElements: string
  }
}

export const scheduleSolution = async (
  _parent: never,
  args: ScheduleSolutionArgs,
  context: RequestContext
): Promise<string> => {
  const { user } = context
  const { solutionId, graphId, graphElements } = args.context

  await authorize({
    user,
    resource: {
      id: graphId,
      type: 'graph',
      action: 'execute',
    },
  })

  await db.setex(
    `graph:${graphId}:solution:${solutionId}:json`,
    60 * 60,
    graphElements
  )

  const job = await ghq.createJob({ graphId, solutionId }).save()

  console.log(`[ JOB ] [ CREATE ] [ SOLUTION ${job.id.padStart(4, '0')} ]`)

  return solutionId
}
