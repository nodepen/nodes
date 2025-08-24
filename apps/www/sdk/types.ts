
export type SpeckleRequestContext = {
  speckleServerUrl: string
  speckleToken: string
}

export type NodePenDocumentManifest = {
  meta: {
    id: string
    name: string
  }
  speckle: {
    projectId: string
    modelId: string
    documentModel: {
      id: string
      rootObjectId?: string
    }
    outputModel: {
      id: string
      rootObjectId?: string
    }
  }
}