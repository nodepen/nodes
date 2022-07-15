import type { DocumentNode } from './DocumentNode'
import type { NodeTemplate } from './templates'

export type Document = {
    id: string
    nodes: { [id: string]: DocumentNode }
    templates: { [id: string]: NodeTemplate }
    version: 1
}