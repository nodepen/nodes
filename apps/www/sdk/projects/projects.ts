import gql from "graphql-tag";
import { SpeckleRequestContext } from "../types";
import { issueSpeckleRequest } from "../common";

/**
 * @returns id of newly created project
 */
export const createProject =
  (context: SpeckleRequestContext) =>
    async (params: { workspaceId: string, projectName: string }): Promise<string> => {
      const { workspaceId, projectName } = params

      const query = gql`
        mutation CreateProject($input: WorkspaceProjectCreateInput!) {
          workspaceMutations {
            projects {
              create(input: $input) {
                id
              }
            }
          }
        }
      `

      const data = await issueSpeckleRequest(context)(query, {
        input: {
          name: projectName,
          workspaceId
        }
      })

      const projectId = data?.workspaceMutations?.projects?.create?.id

      if (!projectId) {
        throw new Error("Failed to create project!")
      }

      return projectId
    }