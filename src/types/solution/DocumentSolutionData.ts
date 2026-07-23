import type { NodeSolutionData } from './NodeSolutionData'

export type DocumentSolutionData = {
    solutionId: string
    solutionModelUrl: string | null
    solutionStatusMessages: DocumentSolutionStatusMessage[]
    documentRuntimeData: DocumentRuntimeData | null
    nodeSolutionData: {
        [nodeInstanceId: string]: NodeSolutionData
    }
}

export type DocumentSolutionStatusMessage = {
    status: 'ok' | 'error' | 'pending' | 'idle'
    message: string
}

type DocumentRuntimeData = {
    durationMs: number
}
