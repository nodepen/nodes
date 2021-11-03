import { db } from '../../../../redis'
import { ghq } from '../../../../bq'
import { authorize } from '../../../utils/authorize'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

export const Mutation: BaseResolverMap<never, Arguments['Mutation']> = {
  scheduleSolution: async (
    _parent,
    { observerId, graphJson, graphId, solutionId },
    { user }
  ): Promise<string> => {
    await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'execute',
    })

    db.client.publish(
      'SOLUTION_START',
      JSON.stringify({
        onSolutionStart: { observerId, graphJson, graphId, solutionId },
      })
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
  updateSelection: async (
    _parent,
    { observerId, graphId, selection },
    { user }
  ) => {
    await authorize(user)

    db.client.publish(
      'UPDATE_SELECTION',
      JSON.stringify({ onUpdateSelection: { observerId, graphId, selection } })
    )

    return { observerId, graphId, selection }
  },
  updateVisibility: async (
    _parent,
    { observerId, graphId, graphJson },
    { user }
  ) => {
    await authorize(user)

    console.log('VIS')

    db.client.publish(
      'UPDATE_VISIBILITY',
      JSON.stringify({
        onUpdateVisibility: {
          observerId,
          graphId,
          graphJson,
        },
      })
    )

    return { observerId, graphId, graphJson }
  },
}
