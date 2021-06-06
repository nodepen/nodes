export type OverlayState = {
  show: {
    parameterMenu: boolean
    tooltip: boolean
  }
  parameterMenu: {
    source: {
      elementId: string
      parameterId: string
      type: 'input' | 'output' | 'unset'
    }
    connection: {
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
