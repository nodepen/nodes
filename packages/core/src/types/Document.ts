import type { DocumentNode } from './DocumentNode'
import type { DocumentTemplate } from './DocumentTemplate'

export type Document = {
    id: string
    nodes: { [id: string]: DocumentNode }
    templates: { [id: string]: DocumentTemplate }
    version: 1
}