import type { DocumentControls } from './controls/DocumentControls'
import type { DocumentGroup } from './DocumentGroup'
import type { DocumentNode } from './DocumentNode'
import type { DocumentSettings } from './settings/DocumentSettings'

export type Document<DocumentMetadata = {}> = {
    id: string
    meta: {
        name: string
    } & DocumentMetadata & Record<string, any>
    nodes: { [id: string]: DocumentNode }
    groups: { [id: string]: DocumentGroup }
    controls: DocumentControls
    settings: DocumentSettings
    version: 1
}
