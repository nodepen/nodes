import type { NodeSolutionData } from './NodeSolutionData'

export type DocumentSolutionData = {
    solutionId: string
    solutionModelUrl: string | null
    documentRuntimeData: DocumentRuntimeData
    nodeSolutionData: {
        [nodeInstanceId: string]: NodeSolutionData
    }
}

export type DocumentSolutionFlags = {
    isExpired: boolean
    isModelExpired: boolean
    isFailed: boolean
}

export type DocumentSolutionStatusMessage = {
    status: 'ok' | 'error' | 'pending' | 'idle'
    message: string
}

type DocumentRuntimeData = {
    exceptionMessages?: string[]
    durationMs: number
}
