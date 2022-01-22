import { Grasshopper, NodePen } from 'glib'
import { newGuid } from './newGuid'

/**
 * Given an array of component parameters, return their instance id => template index map.
 * TODO: If applicable, also return their default values.
 * @param parameters
 * @returns
 */
const initializeParameterIds = (parameters: Grasshopper.Parameter[]): { [instanceId: string]: number } => {
  return parameters.reduce((p, _, i) => {
    p[newGuid()] = i
    return p
  }, {} as { [key: string]: number })
}

type ElementData = NodePen.Element<'static-component'>['current']

export const initializeParameters = (
  template: Grasshopper.Component
): [
  sources: ElementData['sources'],
  values: ElementData['values'],
  inputs: ElementData['inputs'],
  outputs: ElementData['outputs']
] => {
  const inputs = initializeParameterIds(template.inputs)
  const outputs = initializeParameterIds(template.outputs)

  const sources = Object.keys(inputs).reduce((all, id) => {
    all[id] = []
    return all
  }, {} as ElementData['sources'])

  // TODO: Parse default values somehow
  const values = Object.keys(inputs).reduce((all, id) => {
    all[id] = {}
    return all
  }, {} as ElementData['values'])

  return [sources, values, inputs, outputs]
}
