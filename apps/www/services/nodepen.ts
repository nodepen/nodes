import { getDb } from "@/schema/db";
import { documents } from "@/schema/documents";
import { projects } from "@/schema/speckle";
import { createModel, tryGetModelLatestVersion } from "@/sdk/models/models";
import { NodePenDocumentManifest, SpeckleRequestContext } from "@/sdk/types";
import cryptoRandomString from "crypto-random-string";
import { eq } from "drizzle-orm";
import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";
import { commitObject } from "./speckle";
import * as NodePen from '@nodepen/core'

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

      // Write initial document data
      const initialDocument: NodePen.Document = {
        id: newDocument.id,
        meta: {
          name: newDocument.name
        },
        nodes: {},
        version: 1,
        configuration: {
          inputs: [],
          outputs: []
        }
      }

      const version = await commitObject(userContext)({
        data: {
          ...initialDocument,
          speckle_type: 'NodePen_Document'
        },
        projectId,
        modelId: documentModelId,
      })

      return {
        meta: {
          id: newDocument.id,
          name: newDocument.name
        },
        speckle: {
          projectId: projectId,
          modelId: rootModelId,
          documentModel: {
            id: documentModelId,
            rootObjectId: version.referencedObject
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

export const getDocument =
  (context: SpeckleRequestContext) =>
    async (params: { documentId: string }): Promise<NodePenDocumentManifest> => {
      const { documentId } = params

      const db = await getDb()

      const doc = await db.query.documents.findFirst({
        where: eq(documents.id, documentId),
        with: {
          author: {
            with: {
              project: {
                columns: {
                  projectId: true
                }
              }
            }
          }
        }
      })

      if (!doc) {
        throw new Error('Failed to find doc')
      }

      const projectId = doc.author.project.projectId

      if (!projectId) {
        throw new Error('Missing project id')
      }

      const documentModelVersion = await tryGetModelLatestVersion(context)({ projectId, modelId: doc.documentModelId })
      const outputModelVersion = await tryGetModelLatestVersion(context)({ projectId, modelId: doc.outputModelId })

      const manifest: NodePenDocumentManifest = {
        meta: {
          id: doc.id,
          name: doc.name
        },
        speckle: {
          projectId,
          modelId: doc.rootModelId,
          documentModel: {
            id: doc.documentModelId,
            rootObjectId: documentModelVersion?.rootObjectId
          },
          outputModel: {
            id: doc.outputModelId,
            rootObjectId: outputModelVersion?.rootObjectId
          }
        }
      }

      return manifest
    }