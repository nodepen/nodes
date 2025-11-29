import type { NodeSolutionData } from './NodeSolutionData'

export type DocumentSolutionData = {
  solutionId: string
  documentRuntimeData: DocumentRuntimeData
  nodeSolutionData: NodeSolutionData[]
}

type DocumentRuntimeData = {
  durationMs: number
}
