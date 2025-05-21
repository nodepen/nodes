import gql from "graphql-tag";
import { SpeckleRequestContext } from "../types";
import { issueSpeckleRequest } from "../common";


export const tryGetWorkspaceRole =
  (context: SpeckleRequestContext) =>
    async (params: { workspaceId: string }): Promise<string | null> => {
      const { workspaceId } = params

      const query = gql`
        query GetWorkspaceRole($workspaceId: String!) {
          workspace(id: $workspaceId) {
            id
            role
          }
        }
      `

      const data = await issueSpeckleRequest(context)(query, {
        workspaceId
      })

      return data.workspace?.role ?? null
    }