import { acceptWorkspaceInvite, inviteToWorkspace, tryGetWorkspaceInvite } from "@/sdk/workspaces/invites"
import { getSpeckleWorkspaceAdminRequestContext, getSpeckleRequestContext, getSpeckleUserId } from "@/utils/auth"
import { getEnv } from "@/utils/env"
import { NextRequest } from "next/server"

const handler = async (req: NextRequest) => {
  const env = getEnv()
  const adminContext = getSpeckleWorkspaceAdminRequestContext()

  const userId = await getSpeckleUserId(req)
  const userContext = await getSpeckleRequestContext(req)

  if (!userContext || !userId) {
    return Response.json({ message: 'oh no' })
  }

  await inviteToWorkspace(adminContext)({
    workspaceId: env.SPECKLE_WORKSPACE_ID,
    userId,
  })

  const invite = await tryGetWorkspaceInvite(userContext)({
    workspaceId: env.SPECKLE_WORKSPACE_ID
  })

  if (!invite) {
    return Response.json({ message: 'womp womp' })
  }

  await acceptWorkspaceInvite(userContext)({
    token: invite.token
  })

  return Response.json({ ok: true })
}

export { handler as GET, handler as POST }