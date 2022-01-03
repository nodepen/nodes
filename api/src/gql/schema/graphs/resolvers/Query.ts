import { NodePen } from 'glib'
import { authorize } from '../../../../gql/utils'
import { admin } from '../../../../firebase'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'
import { hydrateGraphRecord } from '../utils'

type GraphResponse = Omit<NodePen.GraphManifest, 'graph'>

export const Query: BaseResolverMap<never, Arguments['Query']> = {
  graph: async (
    _parent,
    { graphId },
    { user }
  ): Promise<GraphResponse | undefined> => {
    const db = admin.firestore()

    const graphReference = db.collection('graphs').doc(graphId)
    const graphDocument = await graphReference.get()

    if (!graphDocument.exists) {
      return undefined
    }

    // Determine user relationship to graph
    const isAuthor = user.id === graphDocument.get('author.id')

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

    // Get current version information
    const currentRevision = graphDocument.get('revision')?.toString() as string

    if (!currentRevision) {
      return undefined
    }

    const versionReference = db
      .collection('graphs')
      .doc(graphId)
      .collection('revisions')
      .doc(currentRevision)
    const versionDocument = await versionReference.get()

    if (!versionDocument.exists) {
      return undefined
    }

    const record: GraphResponse = {
      id: graphId,
      name: graphDocument.get('name'),
      author: {
        name: graphDocument.get('author.name'),
        id: 'N/A',
      },
      files: {
        graphBinaries: versionDocument.get('files.graphBinaries'),
        graphJson: versionDocument.get('files.graphJson'),
        graphSolutionJson: versionDocument.get('files.graphSolutionJson'),
      },
      stats: {
        views: nextViewCount,
      },
    }

    return record
  },
  graphsByAuthor: async (
    _parent,
    { author },
    { user }
  ): Promise<GraphResponse[]> => {
    const db = admin.firestore()

    const query = db.collection('graphs').where('author.name', '==', author)
    const queryResults = await query.get()

    const hydrationResults = await Promise.allSettled(
      queryResults.docs.map((doc) => hydrateGraphRecord(doc))
    )

    const result = hydrationResults.reduce((all, current) => {
      switch (current.status) {
        case 'fulfilled': {
          return [...all, current.value]
        }
        case 'rejected': {
          console.error(current.reason)
          return all
        }
      }
    }, [] as GraphResponse[])

    return result
  },
  graphsByPopularity: async (
    _parent,
    _args,
    { user }
  ): Promise<GraphResponse[]> => {
    const db = admin.firestore()

    const query = db.collection('graphs').orderBy('stats.viewsIndex').limit(5)
    const queryResults = await query.get()

    const hydrationResults = await Promise.allSettled(
      queryResults.docs.map((doc) => hydrateGraphRecord(doc))
    )

    const result = hydrationResults.reduce((all, current) => {
      switch (current.status) {
        case 'fulfilled': {
          return [...all, current.value]
        }
        case 'rejected': {
          console.error(current.reason)
          return all
        }
      }
    }, [] as GraphResponse[])

    return result
  },
}
