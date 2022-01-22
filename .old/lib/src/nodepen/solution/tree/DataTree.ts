import { DataTreeValue } from './DataTreeValue'
import { SolutionValueType } from '../value'

export type DataTree = {
    [path: string]: DataTreeValue<SolutionValueType>[]
}