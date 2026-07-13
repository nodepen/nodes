import type { NodeSolutionData } from './NodeSolutionData'

export type DocumentSolutionData = {
    solutionId: string
    solutionModelUrl: string | null
    documentRuntimeData: DocumentRuntimeData | null
    nodeSolutionData: {
        [nodeInstanceId: string]: NodeSolutionData
    }
}

type DocumentRuntimeData = {
    durationMs: number
}
