import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'
import { NodePen } from 'glib'
import { admin } from '../../../../firebase'

type ParentObject = {
  id: string
  revision: string
}

export const GraphManifest: BaseResolverMap<
  ParentObject,
  Arguments['GraphManifest']
> = {
  files: async ({ id, revision }): Promise<NodePen.GraphManifest['files']> => {
    const db = admin
      .firestore()
      .collection('graphs')
      .doc(id)
      .collection('revisions')

    const revisionRef = db.doc(revision)
    const revisionDoc = await revisionRef.get()

    if (!revisionDoc) {
      return {}
    }

    // console.log(revisionDoc.data())

    return revisionDoc.data().files ?? {}
  },
}
