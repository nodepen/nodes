import gql from "graphql-tag";
import { SpeckleRequestContext } from "../types";
import { issueSpeckleRequest } from "../common";

export const updateProjectRole =
  (context: SpeckleRequestContext) =>
    async (params: { projectId: string, userId: string, role: 'stream:contributor' | 'stream:reviewer' }): Promise<void> => {
      const { projectId, userId, role } = params

      const query = gql`
        mutation UpdateProjectRole($projectId: ID!, $inputs: [WorkspaceProjectInviteCreateInput!]!) {
          projectMutations {
            invites {
              createForWorkspace(projectId: $projectId, inputs: $inputs) {
                id
              }
            }
          }
        }
      `

      await issueSpeckleRequest(context)(query, {
        projectId,
        inputs: [
          {
            userId,
            role,
            workspaceRole: 'workspace:guest'
          }
        ]
      })
    }