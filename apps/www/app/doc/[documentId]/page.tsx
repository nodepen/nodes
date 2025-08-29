import { cookies } from 'next/headers'
import { getServerSession } from "next-auth/next"
import { config } from '@/app/api/auth/[...nextauth]/utils'
import { getSpeckleRequestContextFromCookies, getTokenFromCookies } from '@/utils/auth'
import { getDocument } from '@/services/nodepen'
import type * as NodePen from '@nodepen/core'
import NodesAppContainer from '@/components/editor/GraphEditor'
import ObjectLoader from '@speckle/objectloader'

export const dynamic = 'force-dynamic'

const fetchTemplates = async (): Promise<NodePen.NodeTemplate[]> => {
  const res = await fetch('http://localhost:9000/api/templates')
  const data = await res.json()
  return data.templates
}

export default async function Page({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  const session = await getServerSession(config)
  console.log(session)
  const { documentId } = await params
  const { getAll } = await cookies()
  const context = await getSpeckleRequestContextFromCookies(getAll())

  const templates = await fetchTemplates()
  const manifest = await getDocument(context)({ documentId })

  const tryLoadDocument = async (objectId?: string): Promise<NodePen.Document | undefined> => {
    if (!objectId) {
      return undefined
    }

    const loader = new ObjectLoader({
      serverUrl: context.speckleServerUrl,
      token: context.speckleToken,
      streamId: manifest.speckle.projectId,
      objectId,
    })

    const document = await loader.getRootObject()

    return document as NodePen.Document
  }

  const document = await tryLoadDocument(manifest.speckle.documentModel.rootObjectId)

  return <NodesAppContainer templates={templates} manifest={manifest} initialDocument={document} />
}