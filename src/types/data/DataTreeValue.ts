import type { DataTreeValueType } from './DataTreeValueType'

export type DataTreeValue =
    | {
        readonly type: DataTreeValueType
        readonly description: string
        readonly order: number
        readonly value?: string
        readonly geometry?: unknown
    }
    | {
        readonly type: 'reference'
        readonly description: string
        readonly order: string
        readonly value?: never
        readonly sourceKey: string // Source file key
        readonly sourceGuid: string // Guid of geometry in file
    }
