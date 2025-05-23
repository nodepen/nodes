import { getDb } from "@/schema/db";
import { projects } from "@/schema/speckle";
import { getActiveUserRoles } from "@/sdk/auth/auth";
import { createProject } from "@/sdk/projects/projects";
import { updateProjectRole } from "@/sdk/projects/roles";
import { SpeckleRequestContext } from "@/sdk/types";
import { acceptWorkspaceInvite, inviteToWorkspace, tryGetWorkspaceInvite } from "@/sdk/workspaces/invites";
import { updateWorkspaceSeat } from "@/sdk/workspaces/seats";
import { getSpeckleWorkspaceAdminRequestContext } from "@/utils/auth";
import { getEnv } from "@/utils/env";
import { eq } from "drizzle-orm";

/**
 * Ensure the authenticated speckle user can interact with required workspace data
 */
export const ensureWorkspaceAccess =
  (userContext: SpeckleRequestContext) =>
    async (params: { userId: string, userEmail: string }) => {
      const { userId, userEmail } = params

      const adminContext = getSpeckleWorkspaceAdminRequestContext()
      const env = getEnv()
      const db = await getDb()

      const rootWorkspaceId = env.SPECKLE_WORKSPACE_ID

      const rootProject = await db.query.projects.findFirst({
        where: eq(projects.userId, userId)
      })
      let rootProjectId = rootProject?.projectId

      // If user does not have a root project stored in nodepen db
      if (!rootProjectId) {
        // Create a project for the user in the workspace
        const projectId = await createProject(adminContext)({
          workspaceId: rootWorkspaceId,
          projectName: userEmail.toLowerCase()
        })

        rootProjectId = projectId

        // Store their project in the nodepen db
        await db.insert(projects).values({
          userId,
          projectId: rootProjectId
        }).onConflictDoNothing({
          target: [projects.projectId]
        })
      }

      // Get current workspace and project roles
      const [workspaceRole, projectRole] = await getActiveUserRoles(userContext)({
        workspaceId: rootWorkspaceId,
        projectId: rootProjectId
      })

      // Assign user as workspace guest with an editor seat
      if (!workspaceRole) {
        await inviteToWorkspace(adminContext)({
          workspaceId: env.SPECKLE_WORKSPACE_ID,
          userId,
        })

        const invite = await tryGetWorkspaceInvite(userContext)({
          workspaceId: env.SPECKLE_WORKSPACE_ID
        })

        if (invite) {
          await acceptWorkspaceInvite(userContext)({
            token: invite.token
          })

          await updateWorkspaceSeat(adminContext)({
            workspaceId: env.SPECKLE_WORKSPACE_ID,
            userId,
            seatType: 'editor'
          })
        }
      }

      // Assign user as a project collaborator
      if (!projectRole) {
        await updateProjectRole(adminContext)({
          projectId: rootProjectId,
          userId,
          role: 'stream:contributor'
        })
      }

      // TODO: If project not found, heal somehow. But this is only if Speckle folks fuck with their project.
    }