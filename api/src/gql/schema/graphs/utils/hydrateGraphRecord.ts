import { NodePen } from 'glib'
import { admin } from '../../../../firebase'

type GraphResponse = Omit<NodePen.GraphManifest, 'graph'>

/**
 * Given a top-level graph record from the database, return a manifest with information and urls
 * for the latest revision.
 */
export const hydrateGraphRecord = async (
  doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
): Promise<GraphResponse> => {
  const db = admin.firestore()

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

  const revisionDoc = await revisionRef.get()

  if (!revisionDoc.exists) {
    return record
  }

  record.files.graphBinaries = revisionDoc.get('files.graphBinaries')
  record.files.graphJson = revisionDoc.get('files.graphJson')
  record.files.graphBinaries = revisionDoc.get('files.graphBinaries')

  const bucket = admin.storage().bucket('np-graphs')

  const getFileUrl = async (path?: string): Promise<string | undefined> => {
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

  const thumbnailImageRequest = new Promise<void>((resolve, reject) => {
    const thumbnailImagePath = revisionDoc.get('files.thumbnailImage')
    getFileUrl(thumbnailImagePath)
      .then((url) => {
        record.files.thumbnailImage = url
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })

  const thumbnailVideoRequest = new Promise<void>((resolve, reject) => {
    const thumbnailVideoPath = revisionDoc.get('files.thumbnailVideo')
    getFileUrl(thumbnailVideoPath)
      .then((url) => {
        record.files.thumbnailVideo = url
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })

  await Promise.allSettled([thumbnailImageRequest, thumbnailVideoRequest])

  return record
}
