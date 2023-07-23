import type { DataTreeBranch } from './DataTreeBranch'
import type { DataTreeStats } from './DataTreeStats'

export type DataTree = {
  branches: DataTreeBranch[]
  stats: DataTreeStats
}
