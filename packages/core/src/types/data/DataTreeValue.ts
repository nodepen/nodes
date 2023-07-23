import type { DataTreeValueType } from './DataTreeValueType'

export type DataTreeValue = {
  readonly type: DataTreeValueType
  readonly description: string
  readonly order: number
  readonly value?: string
  readonly geometry?: unknown
}
