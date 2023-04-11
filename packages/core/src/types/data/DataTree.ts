import type { DataTreePath } from './DataTreePath'
import type { DataTreeValue } from './DataTreeValue'

export type DataTree = {
  [key: DataTreePath]: DataTreeValue[]
}
