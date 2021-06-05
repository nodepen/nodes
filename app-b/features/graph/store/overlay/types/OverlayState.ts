export type OverlayState = {
  show: {
    parameterMenu: boolean
    tooltip: boolean
  }
  parameterMenu: {
    source: {
      elementId: string
      parameterId: string
    }
    connection: {
      sourceType: 'input' | 'output'
      from?: {
        elementId: string
        parameterId: string
      }
      to?: {
        elementId: string
        parameterId: string
      }
    }
  }
}
