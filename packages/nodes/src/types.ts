export type NodePortReference = {
  nodeInstanceId: string
  portInstanceId: string
}

export type WireEditMode = 'set' | 'merge' | 'remove' | 'move'
