import type { DocumentNode } from './DocumentNode'

export type Document = {
    id: string
    nodes: { [id: string]: DocumentNode }
    configuration: {
        pinnedPorts: {
            nodeInstanceId: string
            portInstanceId: string
        }[]
    }
    version: 1
}