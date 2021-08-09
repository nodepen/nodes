import { NodePen, assert } from 'glib'

export const isInputOrOutput = (
  element: NodePen.Element<NodePen.ElementType>,
  parameterId: string
): 'input' | 'output' | undefined => {
  const data = element.current

  if (!assert.element.isGraphElement(data)) {
    // Element does not contain data and will not have inputs or outputs
    return undefined
  }

  switch (element.template.type) {
    case 'static-component': {
      if (!assert.element.isStaticComponent(element)) {
        return undefined
      }

      // Scan inputs
      if (parameterId in element.current.inputs) {
        return 'input'
      }

      // Scan outputs
      if (parameterId in element.current.outputs) {
        return 'output'
      }

      return undefined
    }
    case 'panel':
    case 'number-slider':
    case 'static-parameter': {
      if (parameterId === 'input' || parameterId === 'output') {
        // Parameters are treated as components with one 'input' and one 'output' parameter
        return parameterId
      }

      return undefined
    }
    default: {
      console.debug(`Cannot parse ${element.template.type} for input/output type!`)
      return undefined
    }
  }
}
