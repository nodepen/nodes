import { NextRequest, NextResponse } from 'next/server'
import * as NodePen from '@nodepen/core'
import { getSpeckleRequestContext } from '@/utils/auth'
import { commitObject } from '@/services/speckle'

type RequestBody = {
  document: NodePen.Document
  modelId: string
}

const handler = async (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }) => {
  const context = await getSpeckleRequestContext(req)

  if (!context) {
    throw new Error('Not authenticated!')
  }

  const { projectId } = await params
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

export { handler as POST }
