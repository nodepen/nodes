import { NodePen, Grasshopper, assert } from 'glib'

export const listParameters = (
  element: NodePen.Element<NodePen.ElementType>,
  mode: 'input' | 'output'
): Grasshopper.Parameter[] => {
  switch (element.template.type) {
    case 'static-component': {
      if (!assert.element.isStaticComponent(element)) {
        return []
      }

      return element.template[mode === 'input' ? 'inputs' : 'outputs']
    }
    case 'panel':
    case 'number-slider':
    case 'static-parameter': {
      const shim: Grasshopper.Parameter = {
        name: mode,
        nickname: '',
        description: '',
        type: 'string',
        isOptional: false,
      }

      return [shim]
    }
    default: {
      return []
    }
  }
}
