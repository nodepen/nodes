import { NodePen } from 'glib'
import { admin } from '../../../../firebase'
import { ghq } from '../../../../bq'
import { authorize } from '../../../utils/authorize'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

export const Mutation: BaseResolverMap<never, Arguments['Mutation']> = {
  scheduleSaveGraph: async (
    _parent,
    { graphId, graphJson },
    { user }
  ): Promise<string> => {
    await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'edit',
    })

    const job = await ghq.save.createJob({ graphId, graphJson }).save()

    return job.id
  },
}
