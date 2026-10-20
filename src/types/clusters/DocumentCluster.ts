export type DocumentCluster = {
    instanceId: string
    // A null ref means a new or unset cluster in the document
    ref: {
        documentId: string
        // A null version id means "use latest"
        versionId: string | null
    } | null
    // Presentation only, can be omitted
    meta: {
        documentName: string
        documentThumbnailUrl: string
        documentVersionIndex: number | null
    } | null
    nodeInstanceId: string
}
