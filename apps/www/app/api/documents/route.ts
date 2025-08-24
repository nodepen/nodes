import { getDb } from '@/schema/db'
import { documents } from '@/schema/documents'
import { projects } from '@/schema/speckle'
import { NodePenDocumentManifest } from '@/sdk/types'
import { createDocument } from '@/services/nodepen'
import { getSpeckleRequestContext } from '@/utils/auth'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

const handler = async (req: NextRequest) => {
  const context = await getSpeckleRequestContext(req)
  const db = await getDb()

  if (!context) {
    console.log('🐍 NO CONTEXT')
    return NextResponse.json([])
  }

  const userProjectId = await db.query.projects.findFirst({
    where: eq(projects.userId, context?.speckleUserId)
  })

  if (!userProjectId) {
    console.log('🐍 NO ROOT PROJECT')
    return NextResponse.json([])
  }

  const documentManifests: NodePenDocumentManifest[] = []

  const docs = await db.query.documents.findMany({
    where: eq(documents.authorId, context.speckleUserId),
    orderBy: (documents, { desc }) => [desc(documents.createdAt)]
  })

  for (const doc of docs) {
    documentManifests.push({
      meta: {
        name: doc.name
      },
      speckle: {
        projectId: userProjectId.projectId,
        modelId: doc.rootModelId,
        documentModel: {
          id: doc.documentModelId
        },
        outputModel: {
          id: doc.outputModelId
        }
      }
    })
  }


  return NextResponse.json({ documents })
}

const handlePost = async (req: NextRequest) => {
  const context = await getSpeckleRequestContext(req)
  const db = await getDb()

  if (!context) {
    console.log('🐍 NO CONTEXT')
    return NextResponse.json([])
  }

  const userProjectId = await db.query.projects.findFirst({
    where: eq(projects.userId, context?.speckleUserId)
  })

  if (!userProjectId) {
    console.log('🐍 NO ROOT PROJECT')
    return NextResponse.json([])
  }

  const doc = await createDocument(context)({ userId: context.speckleUserId })

  return NextResponse.json({ document: doc })
}

export { handler as GET, handlePost as POST }