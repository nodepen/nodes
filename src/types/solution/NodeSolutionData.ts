import type { PortSolutionData } from './PortSolutionData'

export type NodeSolutionData = {
  nodeInstanceId: string
  nodeRuntimeData: NodeRuntimeData
  portSolutionData: PortSolutionData[]
}

type NodeRuntimeData = {
  durationMs: number
  messages: NodeRuntimeDataMessage[]
}

type NodeRuntimeDataMessage = {
  level: 'error' | 'warning' | 'info'
  message: string
}
