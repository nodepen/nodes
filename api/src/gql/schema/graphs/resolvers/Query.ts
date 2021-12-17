import { NodePen } from 'glib'
import { authorize } from '../../../../gql/utils'
import { admin } from '../../../../firebase'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

type GraphResponse = Omit<NodePen.GraphManifest, 'graph'>

export const Query: BaseResolverMap<never, Arguments['Query']> = {
  graph: async (
    _parent,
    { graphId },
    { user }
  ): Promise<GraphResponse | undefined> => {
    await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'view',
    })

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

    await graphReference.update('stats.views', nextViewCount)

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

    const hydrationRequests: Promise<GraphResponse>[] = []

    queryResults.forEach((doc) => {
      const req = new Promise<GraphResponse>((resolve) => {
        const record: GraphResponse = {
          id: doc.id,
          name: doc.get('name'),
          author: {
            name: doc.get('author.name'),
            id: 'N/A',
          },
          files: {},
          stats: {
            views: doc.get('stats.views') ?? 0,
          },
        }

        const currentRevision = doc.get('revision')

        const revisionRef = db
          .collection('graphs')
          .doc(doc.id)
          .collection('revisions')
          .doc(currentRevision.toString())

        revisionRef
          .get()
          .then((revisionDoc) => {
            record.files.graphBinaries = revisionDoc.get('files.graphBinaries')
            record.files.graphJson = revisionDoc.get('files.graphJson')
            record.files.graphSolutionJson = revisionDoc.get(
              'files.graphSolutionJson'
            )

            const bucket = admin.storage().bucket('np-graphs')

            const getFileUrl = async (
              path?: string
            ): Promise<string | undefined> => {
              if (!path) {
                return undefined
              }

              const fileReference = bucket.file(path)

              if (process.env.DEBUG === 'true') {
                // Use public url, since local storage emulation is public
                const url = fileReference.publicUrl()

                return url
              } else {
                // Use temporary signed url, since production bucket is private
                const url = await fileReference.getSignedUrl({
                  version: 'v4',
                  action: 'read',
                  expires: Date.now() + 60 * 60 * 1000,
                })

                return url[0]
              }
            }

            const thumbnailImageRequest = new Promise<void>(
              (resolve, reject) => {
                const thumbnailImagePath = revisionDoc.get(
                  'files.thumbnailImage'
                )
                getFileUrl(thumbnailImagePath)
                  .then((url) => {
                    record.files.thumbnailImage = url
                    resolve()
                  })
                  .catch((err) => {
                    reject(err)
                  })
              }
            )

            const thumbnailVideoRequest = new Promise<void>(
              (resolve, reject) => {
                const thumbnailVideoPath = revisionDoc.get(
                  'files.thumbnailVideo'
                )
                getFileUrl(thumbnailVideoPath)
                  .then((url) => {
                    record.files.thumbnailVideo = url
                    resolve()
                  })
                  .catch((err) => {
                    reject(err)
                  })
              }
            )

            Promise.allSettled([thumbnailImageRequest, thumbnailVideoRequest])
              .then(() => {
                resolve(record)
              })
              .catch((err) => {
                console.error(err)
                resolve(record)
              })
          })
          .catch((err) => {
            console.log(err)
            resolve(record)
          })
      })

      hydrationRequests.push(req)
    })

    const hydrationResults = await Promise.allSettled(hydrationRequests)

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
