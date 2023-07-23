import type { DataTreeStructure } from './DataTreeStructure'
import type { DataTreeValueType } from './DataTreeValueType'

export type DataTreeStats = {
  branchCount: number
  branchValueCountDomain: [min: number, max: number]
  treeStructure: DataTreeStructure
  valueCount: number
  valueTypes: DataTreeValueType[]
}
