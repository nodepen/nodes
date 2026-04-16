import type { PortSolutionData } from './PortSolutionData'

export type NodeSolutionData = {
    /** Speckle object id */
    id: string
    nodeInstanceId: string
    nodeRuntimeData: NodeRuntimeData
    portSolutionData: {
        [portInstanceId: string]: PortSolutionData
    }
}

type NodeRuntimeData = {
    durationMs: number
    messages: NodeRuntimeDataMessage[]
}

type NodeRuntimeDataMessage = {
    level: 'error' | 'warning' | 'info'
    message: string
}
