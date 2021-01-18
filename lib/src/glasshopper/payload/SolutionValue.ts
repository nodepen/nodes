import { DataTree } from '../tree'

export type SolutionValue = {
  for: {
    solution: string
    element: string
    parameter: string
  }
  data: DataTree
}
