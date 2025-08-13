import { getDb } from '@/schema/db'
import { projects } from '@/schema/speckle'
import { getProjectModels } from '@/sdk/projects/projects'
import { getSpeckleRequestContext } from '@/utils/auth'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'


type NodePenDocument = {
  meta: {
    name: string
  }
  speckle: {
    rootModelId: string
    documentModel: {
      id: string
      rootObjectId?: string
    }
    outputGeometryModel: {
      id: string
      rootObjectId?: string
    }
    referenceGeometryModel: {
      id: string
      rootObjectId?: string
    }
  }
}

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

  const models = await getProjectModels(context)({ projectId: userProjectId.projectId })

  const documents: NodePenDocument[] = []

  for (const model of models) {
    if (model.childrenTree.length === 0) {
      continue
    }

    const documentModel = model.childrenTree.find((child) => child.name === 'document')
    const outputGeometryModel = model.childrenTree.find((child) => child.name === 'outputgeometry')
    const referenceGeometryModel = model.childrenTree.find((child) => child.name === 'referencegeometry')

    if (!documentModel || !outputGeometryModel || !referenceGeometryModel) {
      continue
    }

    documents.push({
      meta: {
        name: model.name
      },
      speckle: {
        rootModelId: model.id,
        documentModel: {
          id: documentModel.model.id,
          rootObjectId: documentModel.model.versions.items.at(0)?.referencedObject
        },
        outputGeometryModel: {
          id: outputGeometryModel.model.id,
          rootObjectId: outputGeometryModel.model.versions.items.at(0)?.referencedObject
        },
        referenceGeometryModel: {
          id: referenceGeometryModel.model.id,
          rootObjectId: referenceGeometryModel.model.versions.items.at(0)?.referencedObject
        }
      }
    })
  }

  return NextResponse.json({ documents, models })
}

export { handler as GET }