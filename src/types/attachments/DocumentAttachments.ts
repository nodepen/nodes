export type DocumentAttachmentType = 'reference_model' | 'blob'

export type DocumentAttachments = {
    [K in DocumentAttachmentType]?: {
        [fileKey: string]: string
    }
}
