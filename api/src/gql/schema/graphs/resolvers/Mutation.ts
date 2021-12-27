import { NodePen } from 'glib'
import { v4 as uuid } from 'uuid'
import { admin } from '../../../../firebase'
import { ghq } from '../../../../bq'
import { authorize } from '../../../utils/authorize'
import { BaseResolverMap } from '../../base/types'
import { Arguments } from '../types'

export const Mutation: BaseResolverMap<never, Arguments['Mutation']> = {
  deleteGraph: async (_parent, { graphId }, { user }): Promise<string> => {
    const [ref, doc] = await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'delete',
    })

    const db = admin.firestore()

    // Delete graph record
    await db.recursiveDelete(ref)

    // Delete folder from np-graphs bucket
    const bucket = admin.storage().bucket('np-graphs')

    await bucket.deleteFiles({ prefix: `${graphId}/` })

    return graphId
  },
  duplicateGraph: async (_parent, { graphId }, { user }): Promise<string> => {
    const [ref, doc] = await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'view',
    })

    console.log('!')

    const db = admin.firestore()
    const bucket = admin.storage().bucket('np-graphs')

    // Graph record information from current graph revision
    const currentName: string = doc.get('name')
    const currentRevision: number | undefined = doc.get('revision')

    if (!currentRevision) {
      throw new Error('No revision found!')
    }

    const currentRevisionKey = currentRevision.toString()

    const currentRevisionRef = db
      .collection('graphs')
      .doc(graphId)
      .collection('revisions')
      .doc(currentRevisionKey)
    const currentRevisionDoc = await currentRevisionRef.get()

    if (!currentRevisionDoc.exists) {
      throw new Error('Could not find revision!')
    }

    // Create new graph record
    const now = new Date().toISOString()
    const duplicateId = uuid()
    const duplicateName = `${currentName} (Copy)`
    const duplicateManifest = {
      name: duplicateName.length < 100 ? duplicateName : currentName,
      author: {
        name: user.name,
        id: user.id,
      },
      type: 'grasshopper',
      time: {
        created: now,
        updated: now,
      },
      revision: 1,
      stats: {
        views: 0,
      },
    }

    await db.collection('graphs').doc(duplicateId).create(duplicateManifest)

    // Copy revision information and files from current graph
    const duplicateRevision: any = {
      files: {},
      time: {
        created: now,
      },
    }

    for (const [fileType, filePath] of Object.entries<string>(
      currentRevisionDoc.get('files') ?? {}
    )) {
      if (process?.env?.DEBUG === 'true') {
        // Emulator does not have `copy` implemented
        duplicateRevision.files[fileType] = filePath
        continue
      }

      const duplicatePath = filePath.replace(graphId, duplicateId)

      const currentFile = bucket.file(filePath)
      const currentFileExists = await currentFile.exists()

      if (!currentFileExists) {
        continue
      }

      await currentFile.copy(duplicatePath)

      duplicateRevision.files[fileType] = duplicatePath
    }

    await db
      .collection('graphs')
      .doc(duplicateId)
      .collection('revisions')
      .doc('1')
      .create(duplicateRevision)

    // Return new graph's id
    return duplicateId
  },
  renameGraph: async (
    _parent,
    { graphId, name },
    { user }
  ): Promise<NodePen.GraphManifest> => {
    const [ref, doc] = await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'edit',
    })

    // Validate name
    if (name.length === 0 || name.length > 100) {
      throw new Error('Graph name must be between 0 and 100 characters.')
    }

    await ref.update('name', name)

    const record = doc.data() as NodePen.GraphManifest

    return { ...record, name }
  },
  scheduleSaveGraph: async (
    _parent,
    { solutionId, graphId, graphJson },
    { user }
  ): Promise<string> => {
    const [ref, doc] = await authorize(user, {
      id: graphId,
      type: 'graph',
      action: 'edit',
    })

    const db = admin.firestore()

    let revision = 1
    const now = new Date().toISOString()

    if (!doc.exists) {
      ref.create({
        name: 'Untitled Grasshopper Script',
        author: {
          name: user?.name ?? 'Unknown User',
          id: user?.id ?? 'Unknown Id',
        },
        type: 'grasshopper',
        time: {
          created: now,
          updated: now,
        },
        revision,
        stats: {
          views: 0,
        },
      })
    } else {
      revision = (doc.get('revision') ?? 0) + 1
      await ref.update('revision', revision, 'time.updated', now)
    }

    // Copy thumbnail information from previous revision, if it exists
    const previousRevisionRef = await db
      .collection('graphs')
      .doc(graphId)
      .collection('revisions')
      .doc((revision - 1).toString())
    const previousRevisionDoc = await previousRevisionRef.get()

    await db
      .collection('graphs')
      .doc(graphId)
      .collection('revisions')
      .doc(revision.toString())
      .create({
        time: {
          created: now,
        },
        context: {
          graph: graphId,
          solution: solutionId,
        },
        files: {
          graphJson: previousRevisionDoc.get('files.graphJson') ?? '',
          graphSolutionJson:
            previousRevisionDoc.get('files.graphSolutionJson') ?? '',
          graphBinaries: previousRevisionDoc.get('files.graphBinaries') ?? '',
          thumbnailImage: previousRevisionDoc.get('files.thumbnailImage') ?? '',
        },
      })

    const job = await ghq.save
      .createJob({ solutionId, graphId, graphJson, revision })
      .save()

    console.log(
      `[ JOB ] [ GH:SAVE ] [ CREATE ] [ OPERATION ${job.id.padStart(9, '0')} ]`
    )

    return revision.toString()
  },
}
