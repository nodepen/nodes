import { db } from '../../../../redis'
import { ghq } from '../../../../bq'
import { authorize } from '../../../utils/authorize'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

export const Mutation: BaseResolverMap<never, Arguments['Mutation']> = {
  scheduleSolution: async (
    _parent,
    { graphJson, graphId, solutionId },
    { user }
  ): Promise<string> => {
    await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'execute',
    })

    db.client.publish(
      'SOLUTION_START',
      JSON.stringify({ onSolutionStart: { graphJson, graphId, solutionId } })
    )

    await db.setex(
      `graph:${graphId}:solution:${solutionId}:json`,
      60 * 60,
      graphJson
    )

    await db.setex(`user:${user.id}:graph`, 60 * 60, graphId)
    await db.setex(`graph:${graphId}:solution`, 60 * 60, solutionId)

    const job = await ghq.createJob({ graphId, solutionId }).save()

    console.log(`[ JOB ] [ CREATE ] [ SOLUTION ${job.id.padStart(9, '0')} ]`)

    return solutionId
  },
  updateSelection: async (_parent, { graphId, selection }, { user }) => {
    await authorize(user)

    console.log('New selection!')
    console.log({ selection })

    db.client.publish(
      'UPDATE_SELECTION',
      JSON.stringify({ onUpdateSelection: { graphId, selection } })
    )

    return { graphId, selection }
  },
}
