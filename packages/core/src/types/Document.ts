import type { DocumentNode } from './DocumentNode'

export type Document = {
    id: string
    nodes: { [id: string]: DocumentNode }
    version: 1
}