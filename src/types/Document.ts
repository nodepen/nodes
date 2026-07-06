import type { DocumentNode } from './DocumentNode'

export type Document<DocumentMetadata = {}> = {
    id: string
    meta: {
        name: string
    } & DocumentMetadata
    nodes: { [id: string]: DocumentNode }
    controls: {
        inputs: {
            label: string
            description?: string
            nodeInstanceId: string
            portInstanceId: string
        }[]
        outputs: {
            label: string
            description?: string
            nodeInstanceId: string
            portInstanceId: string
        }[]
    }
    version: 1
}
