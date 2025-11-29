export type { Document } from './Document'
export type { DocumentNode } from './DocumentNode'
export type {
  DataTree,
  DataTreeBranch,
  DataTreePath,
  DataTreeStructure,
  DataTreeValue,
  DataTreeValueType,
} from './data'
export type { PortConfiguration, PortFlag } from './ports'
export type { DocumentSolutionData, NodeSolutionData, PortSolutionData } from './solution'
export type { NodeTemplate, PortTemplate } from './templates'

// TODO: non-schema types
export type NodePortReference = {
  nodeInstanceId: string
  portInstanceId: string
}

export type WireEditMode = 'set' | 'merge' | 'remove' | 'move'