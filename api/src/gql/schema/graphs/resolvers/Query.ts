import { admin } from '../../../../firebase'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

type GraphRecord = {
  manifest: {
    id: string
    name: string
    author: string
  }
  files: {
    json?: string
    gh?: string
    thumbnailImage?: string
    thumbnailVideo?: string
  }
}

export const Query: BaseResolverMap<never, Arguments['Query']> = {
  graphsByAuthor: async (
    _parent,
    { author },
    { user }
  ): Promise<GraphRecord[]> => {
    const db = admin.firestore()

    const query = db.collection('graphs').where('author', '==', author)
    const queryResults = await query.get()

    const hydrationRequests: Promise<GraphRecord>[] = []

    queryResults.forEach((doc) => {
      const req = new Promise<GraphRecord>((resolve) => {
        const record: GraphRecord = {
          manifest: {
            id: doc.id,
            name: doc.get('name'),
            author: doc.get('author'),
          },
          files: {},
        }

        const currentRevision = doc.get('revision')

        const revisionRef = db
          .collection('graphs')
          .doc(doc.id)
          .collection('revisions')
          .doc(currentRevision)

        revisionRef
          .get()
          .then((revisionDoc) => {
            record.files.json = revisionDoc.get('files.json')
            record.files.json = revisionDoc.get('files.json')

            const thumbnailImagePath = revisionDoc.get('files.thumbnailImage')
            const thumbnailVideoPath = revisionDoc.get('files.thumbnailVideo')

            console.log({ thumbnailImagePath })
            console.log({ thumbnailVideoPath })

            resolve(record)
          })
          .catch((err) => {
            console.log(err)
            resolve(record)
          })
      })

      hydrationRequests.push(req)
    })

    const hydrationResults = await Promise.allSettled(hydrationRequests)

    return hydrationResults
      .filter(
        (res): res is PromiseFulfilledResult<GraphRecord> =>
          res.status === 'fulfilled'
      )
      .map((res) => res.value)
  },
}
