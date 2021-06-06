export type ShowPayload = {
  menu: 'parameterMenu'
  sourceType: 'input' | 'output'
  sourceElementId: string
  sourceParameterId: string
}

export type ConnectionPayload = {
  type: 'input' | 'output'
  elementId: string
  parameterId: string
}
