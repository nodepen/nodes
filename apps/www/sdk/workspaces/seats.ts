import gql from "graphql-tag";
import { SpeckleRequestContext } from "../types";
import { issueSpeckleRequest } from "../common";

export const updateWorkspaceSeat =
  (context: SpeckleRequestContext) =>
    async (params: { workspaceId: string, userId: string, seatType: 'editor' | 'viewer' }): Promise<void> => {
      const { workspaceId, userId, seatType } = params

      const query = gql`
        mutation UpdateWorkspaceSeat($input: WorkspaceUpdateSeatTypeInput!) {
          workspaceMutations {
            updateSeatType(input: $input) {
              id
            }
          }
        }
      `

      await issueSpeckleRequest(context)(query, {
        input: {
          userId,
          workspaceId,
          seatType
        }
      })
    }