import gql from "graphql-tag"
import { issueSpeckleRequest } from "../common"
import { SpeckleRequestContext } from "../types"

export const inviteToWorkspace =
  (context: SpeckleRequestContext) =>
    async (params: { workspaceId: string, userId: string }): Promise<void> => {
      const { workspaceId, userId } = params

      const query = gql`
        mutation InviteToWorkspace($workspaceId: String!, $input: WorkspaceInviteCreateInput!) {
          workspaceMutations {
            invites {
              create(workspaceId: $workspaceId, input: $input) {
                id
              }
            }
          }
        }
      `

      await issueSpeckleRequest(context)(query, {
        workspaceId,
        input: {
          userId,
          role: "GUEST"
        }
      })
    }


type PendingInvite = {
  token: string
  inviteId: string
  workspaceId: string
  workspaceName: string
}

/**
 * Get the workspace invite id to the given workspace for the active user
 */
export const tryGetWorkspaceInvite =
  (context: SpeckleRequestContext) =>
    async (params: { workspaceId: string }): Promise<PendingInvite | null> => {
      const { workspaceId } = params

      const query = gql`
          query {
            activeUser {
              workspaceInvites {
                token
                inviteId
                workspaceId
                workspaceName
              }
            }
          }
        `

      const data = await issueSpeckleRequest(context)(query, {})

      return data.activeUser?.workspaceInvites?.find((invite: PendingInvite) => invite.workspaceId === workspaceId) ?? null
    }

export const acceptWorkspaceInvite =
  (context: SpeckleRequestContext) =>
    async (params: { token: string }): Promise<boolean> => {
      const { token } = params

      const query = gql`
          mutation AcceptWorkspaceInvite($input: WorkspaceInviteUseInput!) {
            workspaceMutations {
              invites {
                use(input: $input)
              }
            }
          }
        `

      const data = await issueSpeckleRequest(context)(query, {
        input: {
          token,
          accept: true
        }
      })

      return data?.workspaceMutations?.invites?.use ?? false
    }