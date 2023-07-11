import type { DataTreeBranch } from './DataTreeBranch'
import type { DataTreeStats } from './DataTreeStats'
import type { DataTreeStructure } from './DataTreeStructure'

export type DataTree = {
  branches: DataTreeBranch[]
} & (
  | {
      stats: DataTreeStats
      structure: Exclude<DataTreeStructure, 'empty'>
    }
  | {
      stats: null
      structure: 'empty'
    }
)
