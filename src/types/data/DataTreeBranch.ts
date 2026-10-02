import type { DataTreePath } from './DataTreePath'
import type { DataTreeValue } from './DataTreeValue'

export type DataTreeBranch = {
  order: number
  path: DataTreePath
  values: DataTreeValue[]
}
