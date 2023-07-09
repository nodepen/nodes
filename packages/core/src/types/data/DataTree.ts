import type { DataTreeBranch } from './DataTreeBranch'
import type { DataTreeStats } from './DataTreeStats'
import type { DataTreeStructure } from './DataTreeStructure'

export type DataTree = {
  branches: DataTreeBranch[]
  description: string // "1 list of 2 strings"
  stats: DataTreeStats
  structure: DataTreeStructure
}
