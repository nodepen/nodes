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

type ProjectModel = {
  id: string
  name: string
  childrenTree: {
    name: string
    model: {
      id: string
      versions: {
        items: {
          id: string
          referencedObject: string
        }[]
      }
    }
  }[]
}

export const getProjectModels =
  (context: SpeckleRequestContext) =>
    async (params: { projectId: string }): Promise<ProjectModel[]> => {
      const { projectId } = params

      const query = gql`
          query GetProjectModels($projectId: String!) {
              project(id: $projectId) {
                models {
                  items {
                    id
                    name
                    childrenTree {
                      name
                      model {
                        id
                        versions(limit: 1){
                          items {
                            id
                            referencedObject
                          }
                        }
                      }
                    }
                  }
                }
              }
          }
        `

      const data = await issueSpeckleRequest(context)(query, {
        projectId
      })

      return data?.project?.models?.items ?? []
    }