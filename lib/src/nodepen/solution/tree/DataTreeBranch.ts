import { DataTreeValue } from './DataTreeValue'
import { SolutionValueType } from '../value'

export type DataTreeBranch = {
  path: number[]
  data: DataTreeValue<SolutionValueType>[]
}