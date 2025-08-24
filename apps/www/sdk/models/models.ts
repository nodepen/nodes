import gql from "graphql-tag";
import { SpeckleRequestContext } from "../types";
import { issueSpeckleRequest } from "../common";

export const createModel =
  (context: SpeckleRequestContext) =>
    async (params: {
      projectId: string,
      modelName: string
    }): Promise<string> => {
      const { projectId, modelName } = params

      console.log(params)

      const query = gql`
        mutation CreateModel($input: CreateModelInput!) {
          modelMutations {
            create(input: $input) {
              id
            }
          }
        }
      `

      const data = await issueSpeckleRequest(context)(query, {
        input: {
          projectId,
          name: modelName
        }
      })

      const modelId = data?.modelMutations?.create?.id

      if (!modelId) {
        throw new Error("Failed to create model!")
      }

      return modelId
    }

export const getModelLatestVersion =
  (context: SpeckleRequestContext) =>
    async (params: {
      projectId: string,
      modelId: string
    }): Promise<{ versionId: string, rootObjectId: string, previewUrl?: string }> => {
      const { projectId, modelId } = params

      const query = gql`
          query GetModelLatestVersion($projectId: String!, $modelId: String!) {
            project(id: $projectId) {
              model(id: $modelId) {
                versions(limit: 1) {
                  items {
                    versionId:id
                    rootObjectId:referencedObject
                    previewUrl
                  }
                }
              }
            }
          }
        `

      const data = await issueSpeckleRequest(context)(query, {
        projectId,
        modelId
      })

      const version = data?.project?.model?.versions?.items?.at(0)

      if (!version) {
        throw new Error('Failed to fetch model version!')
      }

      return version
    }