import { GCP } from 'glib'
import { storage } from 'firebase-admin'

type Bucket = ReturnType<storage.Storage['bucket']>

export const uploadFile = async (
  bucket: Bucket,
  path: string,
  data: string | Buffer,
  ttl = 5
): Promise<GCP.Storage.FileReference> => {
  const file = bucket.file(path)
  await file.save(data)

  const isPublic = ttl <= 0 || process?.env?.DEBUG === 'true'

  const url = isPublic
    ? file.publicUrl()
    : (
        await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60 * 24 * ttl,
        })
      )[0]

  return {
    bucket: bucket.name,
    path,
    url,
    ttl,
    updated: new Date().toISOString(),
  }
}
