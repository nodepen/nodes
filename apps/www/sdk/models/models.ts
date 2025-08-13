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