import { Grasshopper } from 'glib'
import { newGuid } from './newGuid'

/**
 * Given an array of component parameters, return their instance id => template index map.
 * TODO: If applicable, also return their default values.
 * @param parameters
 * @returns
 */
export const initializeParameters = (parameters: Grasshopper.Parameter[]): { [instanceId: string]: number } => {
  return parameters.reduce((p, _, i) => {
    p[newGuid()] = i
    return p
  }, {} as { [key: string]: number })
}
