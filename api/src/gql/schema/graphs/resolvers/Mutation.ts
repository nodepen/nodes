import { NodePen } from 'glib'
import { admin } from '../../../../firebase'
import { ghq } from '../../../../bq'
import { authorize } from '../../../utils/authorize'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

export const Mutation: BaseResolverMap<never, Arguments['Mutation']> = {
  scheduleSaveGraph: async (
    _parent,
    { solutionId, graphId, graphJson },
    { user }
  ): Promise<string> => {
    await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'edit',
    })

    const db = admin.firestore()

    const ref = db.collection('graphs').doc(graphId)
    const doc = await ref.get()

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
