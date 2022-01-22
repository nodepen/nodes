import { SolutionGeometry, SolutionValue, SolutionValueType } from '../value'

export type DataTreeValue<T extends SolutionValueType> = T extends 'circle' | 'curve'
? {
    type: T
    value: SolutionValue[T]
    geometry: SolutionGeometry[T]
} : {
  type: T
  value: SolutionValue[T]
}