import { NodePen } from 'glib'
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
      60 * 15,
      graphJson
    )

    await db.setex(`user:${user.id}:graph`, 60 * 15, graphId)
    await db.setex(`graph:${graphId}:solution`, 60 * 15, solutionId)

    const job = await ghq.solve.createJob({ graphId, solutionId }).save()

    console.log(
      `[ JOB ] [ GH:SOLVE ] [ CREATE ] [ SOLUTION ${job.id.padStart(9, '0')} ]`
    )

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
  updateVisibility: async (_parent, { observerId, graphId, ids }, { user }) => {
    await authorize(user)

    // Save visibility to graph
    const latestSolutionId = await db.get(`graph:${graphId}:solution`)

    const elementsJson = await db.get(
      `graph:${graphId}:solution:${latestSolutionId}:json`
    )

    const elements: NodePen.Element<NodePen.ElementType>[] = JSON.parse(
      elementsJson ?? '[]'
    )

    for (const id of ids) {
      const target = elements.find((element) => element.id === id)

      if (!target || !('settings' in target.current)) {
        continue
      }

      const { visibility } = target.current.settings

      target.current.settings.visibility =
        visibility === 'visible' ? 'hidden' : 'visible'
    }

    await db.setex(
      `graph:${graphId}:solution:${latestSolutionId}:json`,
      60 * 15,
      JSON.stringify(elements)
    )

    db.client.publish(
      'UPDATE_VISIBILITY',
      JSON.stringify({
        onUpdateVisibility: {
          observerId,
          graphId,
          ids,
        },
      })
    )

    return { observerId, graphId, ids }
  },
}
