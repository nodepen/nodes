import { Grasshopper } from 'glib'
import { RequestContext } from '../../types'
import { allowed } from '../../../data/allowed'

export const getInstalledComponents = (
  parent: never,
  args: never,
  context: RequestContext
): Grasshopper.Component[] => {
  return allowed
}
