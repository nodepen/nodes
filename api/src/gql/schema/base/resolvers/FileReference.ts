import { GCP } from 'glib'
import { admin } from '../../../../firebase'

type GraphContext = {
  id: string
  revision: number
  fileType: string
}

export const FileReference = {
  url: async ({
    bucket: bucketName,
    path,
    updated,
    ttl,
    url,
    context,
  }: GCP.Storage.FileReference & {
    context: GraphContext
  }): Promise<string> => {
    if (ttl <= 0) {
      // url does not expire
      return url
    }

    console.log(updated)
    console.log(new Date().toISOString())

    const updatedMs = new Date(updated).getTime()
    const nowMs = new Date().getTime() + 1000 * 60 * 60 * 12

    const diff = nowMs - updatedMs
    const allowed = 1000 * 60 * 60 * 24 * ttl

    console.log(diff)
    console.log(allowed)

    // url has not expired
    if (diff < allowed) {
      return url
    }

    // url has expires, update, set, and return new url
    const { id, revision, fileType } = context

    const bucket = admin.storage().bucket(bucketName)
    const file = bucket.file(path)

    const newUrl = (
      await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 24 * ttl,
      })
    )[0]

    const db = admin
      .firestore()
      .collection('graphs')
      .doc(id)
      .collection('revisions')

    const revisionRef = db.doc(revision.toString())

    const record: GCP.Storage.FileReference = {
      bucket: bucketName,
      path,
      updated: new Date().toISOString(),
      url: newUrl,
      ttl,
    }

    await revisionRef.update(`files.${fileType}`, record)

    console.log('OK')

    return newUrl
  },
}
