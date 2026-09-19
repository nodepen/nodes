export type DocumentAttachmentType = 'reference_model' | 'reference_image' | 'generic_data'

export type DocumentAttachments = {
    [K in DocumentAttachmentType]?: {
        [fileKey: string]: string
    }
}
