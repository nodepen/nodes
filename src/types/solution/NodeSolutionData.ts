import type { PortSolutionData } from './PortSolutionData'

export type NodeSolutionData = {
    nodeInstanceId: string
    nodeRuntimeData: NodeRuntimeData
    nodeDynamicData: NodeDynamicData
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

// Per-solve information about available dynamic node operations (like list item param add/remove)
type NodeDynamicData = {
    ports: {
        input: {
            canAdd: boolean[]
            canRemove: boolean[]
        }
        output: {
            canAdd: boolean[]
            canRemove: boolean[]
        }
    }
}
