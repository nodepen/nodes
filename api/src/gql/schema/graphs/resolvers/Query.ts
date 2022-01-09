import { NodePen } from 'glib'
import { authorize } from '../../../../gql/utils'
import { admin } from '../../../../firebase'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'
import { hydrateGraphRecords } from '../utils'
import { GraphResponse } from '../types'

export const Query: BaseResolverMap<never, Arguments['Query']> = {
  graph: async (_parent, { graphId }, { user }): Promise<GraphResponse> => {
    const db = admin.firestore()

    const graphReference = db.collection('graphs').doc(graphId)
    const graphDocument = await graphReference.get()

    if (!graphDocument.exists) {
      return undefined
    }

    // Determine user relationship to graph
    const isAuthor = user.id === graphDocument.get('author.id')

    if (!isAuthor) {
      console.log({ user: user.id })
      console.log({ author: graphDocument.get('author.id') })
    }

    // Update view count
    const currentViewCount = graphDocument.get('stats.views') ?? 0
    const nextViewCount = isAuthor ? currentViewCount : currentViewCount + 1

    const currentViewIndexerCount = graphDocument.get('stats.viewsIndex') ?? 0
    const nextViewIndexerCount = isAuthor
      ? currentViewIndexerCount
      : currentViewIndexerCount - 1

    await graphReference.update(
      'stats.views',
      nextViewCount,
      'stats.viewsIndex',
      nextViewIndexerCount
    )

    const record: GraphResponse = {
      id: graphId,
      name: graphDocument.get('name'),
      author: {
        name: graphDocument.get('author.name'),
        id: 'N/A',
      },
      files: {},
      stats: {
        views: nextViewCount,
      },
      revision: graphDocument.get('revision'),
    }

    return record
  },
  graphsByAuthor: async (
    _parent,
    { author },
    { user }
  ): Promise<GraphResponse[]> => {
    const db = admin.firestore()

    const query = db
      .collection('graphs')
      .where('author.name', '==', author)
      .orderBy('name')
    const queryResults = await query.get()

    return hydrateGraphRecords(queryResults)
  },
  graphsByPopularity: async (
    _parent,
    _args,
    { user }
  ): Promise<GraphResponse[]> => {
    const db = admin.firestore()

    const query = db.collection('graphs').orderBy('stats.viewsIndex').limit(6)
    const queryResults = await query.get()

    return hydrateGraphRecords(queryResults)
  },
}
