import type { DataTreeValueType } from './DataTreeValueType'

export type DataTreeValue =
    | {
        readonly type: DataTreeValueType
        readonly description: string
        readonly order: number
        readonly value?: string
        readonly geometry?: unknown[]
    }
    | {
        readonly type: 'reference'
        readonly description: string
        readonly order: number
        readonly value?: never
        /** bucket key */
        readonly sourceFileKey: string
        readonly sourceFileGuid: string
    }
