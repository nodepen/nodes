import { NodePen, Grasshopper } from 'glib'
import { isInputOrOutput } from './isInputOrOutput'

export const getParameterType = (
  element: NodePen.Element<'static-component' | 'static-parameter' | 'number-slider'>,
  parameterId: string
): Grasshopper.ParameterType | undefined => {
  switch (element.template.type) {
    case 'static-component': {
      const component = element as NodePen.Element<'static-component'>

      const mode = isInputOrOutput(component, parameterId)

      if (!mode) {
        return undefined
      }

      const key: 'inputs' | 'outputs' = `${mode}s`

      const parameter = component.template[key][component.current[key][parameterId]]

      if (!parameter) {
        return undefined
      }

      return parameter.type
    }
    case 'static-parameter': {
      // const parameter = element as NodePen.Element<'static-parameter'>

      // TODO: switch() on parameter guids

      return 'string'
    }
    case 'number-slider': {
      return 'number'
    }
    default: {
      return undefined
    }
  }
}
