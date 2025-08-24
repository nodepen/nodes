import { cookies } from 'next/headers'
import { getServerSession } from "next-auth/next"
import { config } from '@/app/api/auth/[...nextauth]/utils'

export default async function Page({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  const { documentId } = await params
  const session = await getServerSession(config)

  // console.log(session?.user.)
  // const document = await fetch(`/api/documents/${documentId}`, { cache: 'no-store' })

  return <div>
    {/* {JSON.stringify(document, null, 2)} */}
  </div>
}