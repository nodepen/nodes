
export type SpeckleRequestContext = {
  speckleServerUrl: string
  speckleToken: string
}

export type NodePenDocumentManifest = {
  meta: {
    name: string
  }
  speckle: {
    rootProjectId: string
    rootModelId: string
    documentModel: {
      id: string
      rootObjectId?: string
    }
    outputGeometryModel: {
      id: string
      rootObjectId?: string
    }
    referenceGeometryModel: {
      id: string
      rootObjectId?: string
    }
  }
}