import { Glasshopper } from 'glib'

export const isInputOrOutput = (element: Glasshopper.Element.Base, parameter: string): 'input' | 'output' => {
  if (element.template.type === 'static-parameter') {
    return parameter as 'input' | 'output'
  }

  if (element.template.type === 'static-component') {
    const el = element as Glasshopper.Element.StaticComponent

    if (Object.keys(el.current.inputs).includes(parameter)) {
      return 'input'
    }

    if (Object.keys(el.current.outputs).includes(parameter)) {
      return 'output'
    }
  }

  console.log('isInputOrOutput used incorrectly!')
  return 'input'
}