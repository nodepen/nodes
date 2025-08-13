import { getDb } from "@/schema/db";
import { documents } from "@/schema/documents";
import { projects } from "@/schema/speckle";
import { createModel } from "@/sdk/models/models";
import { NodePenDocumentManifest, SpeckleRequestContext } from "@/sdk/types";
import { eq } from "drizzle-orm";

export const createDocument =
  (userContext: SpeckleRequestContext) =>
    async (params: { userId: string, documentName: string }): Promise<NodePenDocumentManifest> => {
      const { userId, documentName } = params

      const db = await getDb()

      const projectId = await getActiveUserProject({ userId })

      const [
        rootModelId,
        documentModelId,
        outputGeometryModelId,
        referenceGeometryModelId
      ] = await Promise.all([
        createModel(userContext)({ projectId, modelName: documentName }),
        createModel(userContext)({ projectId, modelName: `${documentName}/document` }),
        createModel(userContext)({ projectId, modelName: `${documentName}/outputgeometry` }),
        createModel(userContext)({ projectId, modelName: `${documentName}/referencegeometry` }),
      ])

      await db.insert(documents).values({
        authorId: userId,
        rootModelId,
        document: {}
      })

      return {
        meta: {
          name: documentName
        },
        speckle: {
          rootProjectId: projectId,
          rootModelId,
          documentModel: {
            id: documentModelId
          },
          referenceGeometryModel: {
            id: referenceGeometryModelId
          },
          outputGeometryModel: {
            id: outputGeometryModelId
          }
        }
      }
    }

export const getActiveUserProject =
  async (params: { userId: string }): Promise<string> => {
    const { userId } = params

    const db = await getDb()

    const project = await db.query.projects.findFirst({
      where: eq(projects.userId, userId)
    })

    if (!project) {
      throw new Error('Failed to find user project!')
    }

    return project.userId
  }