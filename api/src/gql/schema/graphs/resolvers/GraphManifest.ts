import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'
import { NodePen, GCP } from 'glib'
import { admin } from '../../../../firebase'
import { GraphResponse } from '../types'

export const GraphManifest: BaseResolverMap<
  GraphResponse,
  Arguments['GraphManifest']
> = {
  files: async ({ id, revision }): Promise<NodePen.GraphManifest['files']> => {
    const db = admin
      .firestore()
      .collection('graphs')
      .doc(id)
      .collection('revisions')

    const revisionRef = db.doc(revision.toString())
    const revisionDoc = await revisionRef.get()

    if (!revisionDoc) {
      return {}
    }

    const files = revisionDoc.data()?.files ?? {}

    for (const [fileType, file] of Object.entries(files)) {
      ;(file as any).context = { id, revision, fileType }
    }

    return { ...files }
  },
}
