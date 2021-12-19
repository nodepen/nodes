import { NodePen } from 'glib'
import { admin } from '../../../../firebase'
import { ghq } from '../../../../bq'
import { authorize } from '../../../utils/authorize'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

export const Mutation: BaseResolverMap<never, Arguments['Mutation']> = {
  deleteGraph: async (_parent, { graphId }, { user }): Promise<string> => {
    const [ref, doc] = await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'delete',
    })

    // Delete graph record
    await ref.delete()

    // Delete folder from np-graphs bucket
    const bucket = admin.storage().bucket('np-graphs')

    await bucket.deleteFiles({ prefix: `${graphId}/` })

    return graphId
  },
  renameGraph: async (
    _parent,
    { graphId, name },
    { user }
  ): Promise<NodePen.GraphManifest> => {
    const [ref, doc] = await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'edit',
    })

    // Validate name
    if (name.length === 0 || name.length > 100) {
      throw new Error('Graph name must be between 0 and 100 characters.')
    }

    await ref.update('name', name)

    const record = doc.data() as NodePen.GraphManifest

    return { ...record, name }
  },
  scheduleSaveGraph: async (
    _parent,
    { solutionId, graphId, graphJson },
    { user }
  ): Promise<string> => {
    const [ref, doc] = await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'edit',
    })

    const db = admin.firestore()

    let revision = 1
    const now = new Date().toISOString()

    if (!doc.exists) {
      ref.create({
        name: 'Untitled Grasshopper Script',
        author: {
          name: user?.name ?? 'Unknown User',
          id: user?.id ?? 'Unknown Id',
        },
        type: 'grasshopper',
        time: {
          created: now,
          updated: now,
        },
        revision,
        stats: {
          views: 0,
        },
      })
    } else {
      revision = (doc.get('revision') ?? 0) + 1
      await ref.update('revision', revision, 'time.updated', now)
    }

    await db
      .collection('graphs')
      .doc(graphId)
      .collection('revisions')
      .doc(revision.toString())
      .create({
        time: {
          created: now,
        },
        context: {
          graph: graphId,
          solution: solutionId,
        },
        files: {},
      })

    const job = await ghq.save
      .createJob({ solutionId, graphId, graphJson, revision })
      .save()

    console.log(
      `[ JOB ] [ GH:SAVE ] [ CREATE ] [ OPERATION ${job.id.padStart(9, '0')} ]`
    )

    return revision.toString()
  },
}
