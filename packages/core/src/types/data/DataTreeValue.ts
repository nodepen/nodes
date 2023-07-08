import type { DataTreeValueType } from './DataTreeValueType'

export type DataTreeValue = Readonly<{
  type: DataTreeValueType
  description: string
  value?: unknown // Rhino JSON?
  geometry?: unknown // Speckle
}>
