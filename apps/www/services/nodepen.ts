import { getDb } from "@/schema/db";
import { documents } from "@/schema/documents";
import { projects } from "@/schema/speckle";
import { createModel } from "@/sdk/models/models";
import { NodePenDocumentManifest, SpeckleRequestContext } from "@/sdk/types";
import cryptoRandomString from "crypto-random-string";
import { eq } from "drizzle-orm";
import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";

export const createDocument =
  (userContext: SpeckleRequestContext) =>
    async (params: { userId: string }): Promise<NodePenDocumentManifest> => {
      const { userId } = params

      const db = await getDb()
      const projectId = await getActiveUserProject({ userId })

      const speckleModelName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
        separator: ' ',
        style: 'capital'
      })

      const modelKey = speckleModelName.toLowerCase().replaceAll(' ', '-')

      const [
        rootModelId,
        documentModelId,
        outputModelId,
      ] = await Promise.all([
        createModel(userContext)({ projectId, modelName: modelKey }),
        createModel(userContext)({ projectId, modelName: `${modelKey}/document` }),
        createModel(userContext)({ projectId, modelName: `${modelKey}/output-geometry` }),
      ])

      const newDocuments = await db.insert(documents).values({
        authorId: userId,
        name: speckleModelName,
        rootModelId,
        documentModelId,
        outputModelId
      }).returning()
      const newDocument = newDocuments.at(0)

      if (!newDocument) {
        throw new Error('Failed to make document!')
      }

      return {
        meta: {
          name: newDocument.name
        },
        speckle: {
          projectId: projectId,
          modelId: rootModelId,
          documentModel: {
            id: documentModelId
          },
          outputModel: {
            id: outputModelId
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

    return project.projectId
  }