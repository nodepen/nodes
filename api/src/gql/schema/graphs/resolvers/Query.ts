import { NodePen } from 'glib'
import { admin } from '../../../../firebase'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

type GraphResponse = Omit<NodePen.GraphManifest, 'graph'>

export const Query: BaseResolverMap<never, Arguments['Query']> = {
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
            name: doc.get('author'),
            id: 'N/A',
          },
          files: {},
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
