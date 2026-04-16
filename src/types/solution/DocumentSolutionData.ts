import type { NodeSolutionData } from './NodeSolutionData'

export type DocumentSolutionData = {
    solutionId: string
    isExpired: boolean
    documentRuntimeData: DocumentRuntimeData
    nodeSolutionData: {
        [nodeInstanceId: string]: NodeSolutionData
    }
}

type DocumentRuntimeData = {
    durationMs: number
}
