export type DocumentCluster = {
    // A null ref means a new or unset cluster in the document
    ref: {
        documentId: string
        versionId: string
    } | null
    // Presentation only, can be omitted
    meta: {
        documentName: string
        documentThumbnailUrl: string
        documentVersionIndex: number
    } | null
    nodeInstanceId: string
}
