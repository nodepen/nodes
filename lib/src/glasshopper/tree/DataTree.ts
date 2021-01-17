import { SourceType } from './SourceType'
import { ValueType } from './ValueType'
import * as GH from './values'

export type DataTree = {
  [path: string]: DataTreeValue<ValueType>[]
}

export type DataTreeValue<T extends ValueType> = {
  source: SourceType
  type: T
  data: T extends 'number' ? GH.Number : T extends 'point' ? GH.Point : never
}
