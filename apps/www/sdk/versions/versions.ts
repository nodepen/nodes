import gql from "graphql-tag";
import { SpeckleRequestContext } from "../types";
import { issueSpeckleRequest } from "../common";

type VersionData = {
  id: string
  referencedObject: string
}

export const createVersion =
  (context: SpeckleRequestContext) =>
    async (params: {
      projectId: string,
      modelId: string,
      objectId: string
    }): Promise<VersionData> => {
      const { projectId, modelId, objectId } = params

      const query = gql`
        mutation CreateVersion($input: CreateVersionInput!) {
          versionMutations {
            create(input: $input) {
              id
              referencedObject
            }
          }
        }
      `

      const data = await issueSpeckleRequest(context)(query, {
        input: {
          projectId,
          modelId,
          objectId,
          sourceApplication: 'nodepen'
        }
      })

      const versionData = data?.versionMutations?.create

      if (!versionData) {
        throw new Error('Failed to create version!')
      }

      return versionData
    }