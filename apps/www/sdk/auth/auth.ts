import gql from "graphql-tag"
import { issueSpeckleRequest } from "../common"
import { SpeckleRequestContext } from "../types"

type User = {
  id: string
  name: string
  email: string
  avatar: string
}

export const getActiveUser =
  (context: SpeckleRequestContext) =>
    async () => {
      const query = gql`
        query GetActiveUser {
          activeUser {
            id
            name
            email
            avatar
          }
        }
      `

      const data = await issueSpeckleRequest(context)(query, {})

      return data.activeUser as User
    }

export const getActiveUserRoles =
  (context: SpeckleRequestContext) =>
    async (params: { workspaceId: string, projectId: string }) => {
      const { workspaceId, projectId } = params

      const query = gql`
          query EnsureNodePenConnection($workspaceId: String!, $projectId: String!) {
            workspace(id: $workspaceId) {
              id
              role
            }
            project(id: $projectId) {
              id
              role
            }
          }
        `

      const data = await issueSpeckleRequest(context)(query, {
        workspaceId,
        projectId
      })

      return [
        data?.workspace?.role,
        data?.project?.role
      ]
    }