import type { DataTreeValueType } from './DataTreeValueType'

export type DataTreeValue = Readonly<{
  type: DataTreeValueType
  description: string
  nativeValue?: string
  nativeGeometry?: unknown
  speckleGeometry?: unknown
}>
