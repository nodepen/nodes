import { NextRequest, NextResponse } from 'next/server'
import * as NodePen from '@nodepen/core'
import { getSpeckleRequestContext } from '@/utils/auth'
import { commitObject } from '@/services/speckle'
import { getDb } from '@/schema/db'
import { eq } from 'drizzle-orm'
import { documents } from '@/schema/documents'
import { deleteDocument, getDocument } from '@/services/nodepen'


const handleGet = async (
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) => {
  const context = await getSpeckleRequestContext(req)

  if (!context) {
    throw new Error('Not authenticated!')
  }

  const { documentId } = await params
  const manifest = await getDocument(context)({ documentId })

  return NextResponse.json({ document: manifest })
}

const handleDelete = async (
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) => {
  const context = await getSpeckleRequestContext(req)

  if (!context) {
    throw new Error('Not authenticated!')
  }

  const { documentId } = await params

  await deleteDocument(context)({ documentId })

  return new NextResponse(null, { status: 200 })
}

type RequestBody = {
  document: NodePen.Document
  modelId: string
}

const handlePost = async (
  req: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }) => {
  const context = await getSpeckleRequestContext(req)
  const db = await getDb()

  if (!context) {
    throw new Error('Not authenticated!')
  }

  const { documentId } = await params

  const doc = await db.query.documents.findFirst({
    where: eq(documents.id, documentId),
    with: {
      author: {
        with: {
          project: {
            columns: {
              projectId: true
            }
          }
        }
      }
    }
  })

  const projectId = doc?.author.project.projectId

  if (!projectId) {
    throw new Error('Missing project id reference')
  }

  const { document, modelId } = await req.json() as RequestBody

  const version = await commitObject(context)({
    data: {
      ...document,
      speckle_type: 'NodePen_Document'
    },
    projectId,
    modelId,
  })

  return NextResponse.json({ version })
}

export { handleGet as GET, handleDelete as DELETE, handlePost as POST }
