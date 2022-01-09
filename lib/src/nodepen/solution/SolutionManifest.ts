import { DataTreeValue } from './tree'
import { SolutionValueType } from './value'

/**
 * Solution data as-returned from the compute server. Must be
 * parsed and formatted in a way that the app expects to receive it.
 */
export type SolutionManifest = {
  data: {
    elementId: string
    parameterId: string
    values: {
      path: number[],
      data: DataTreeValue<SolutionValueType>[]
    }[]
  }[]
  messages: {
    elementId: string
    message: string
    level: 'error' | 'warn'
  }[]
  duration: number
  timeout: boolean
}