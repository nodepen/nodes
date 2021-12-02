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
        name: 'Test Name',
        author: user.name ?? 'Test User',
        revision,
        lastUpdated: now,
      })
    } else {
      revision = (doc.get('revision') ?? 0) + 1
      await ref.update('revision', revision, 'lastUpdated', now)
    }

    await db
      .collection('graphs')
      .doc(graphId)
      .collection('revisions')
      .doc(revision.toString())
      .create({
        meta: {
          solutionId,
          createdAt: now,
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
