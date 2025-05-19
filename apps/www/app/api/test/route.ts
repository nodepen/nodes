// export const dynamic = 'force-dynamic'

import { getDb } from "@/schema/db"
import { getActiveUser } from "@/sdk/auth/auth"
import { getSpeckleRequestContext } from "@/utils/auth"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"

const secret = process.env.AUTH_SECRET

const handler = async (req: NextRequest) => {
  const context = await getSpeckleRequestContext(req)

  if (!context) {
    return Response.json({})
  }

  const activeUser = await getActiveUser(context)()

  console.log({ activeUser })

  const db = await getDb()

  await db.query.users.findMany({
    limit: 10
  })

  return Response.json({})
}

export { handler as GET, handler as POST }