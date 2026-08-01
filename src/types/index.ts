export type { Document } from './Document'
export type { DocumentNode } from './DocumentNode'
export type { NumberSliderConfig, PanelConfig } from './config'
export type {
    DataTree,
    DataTreeBranch,
    DataTreePath,
    DataTreeStructure,
    DataTreeValue,
    DataTreeValueType,
} from './data'
export type { PortConfiguration, PortFlag } from './ports'
export type { DocumentSolutionData, DocumentSolutionStatusMessage, NodeSolutionData, PortSolutionData } from './solution'
export type { NodeTemplate, PortTemplate } from './templates'
export type { DocumentAssets } from './assets'
export type { DocumentPresence } from './presence'

export type NodePortReference = {
    nodeInstanceId: string
    portInstanceId: string
}

export type WireEditMode = 'set' | 'merge' | 'remove' | 'move'