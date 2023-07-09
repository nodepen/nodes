import type { DataTreeValueType } from './DataTreeValueType'

export type DataTreeStats = {
  branchCount: number
  types: DataTreeValueType[]
  valueCount: number
}
