import { Grasshopper } from 'glib'
import { RequestContext } from '../../types'

export const getInstalledComponents = (
  parent: never,
  args: never,
  context: RequestContext
): Grasshopper.Component[] => {
  console.log(context.user)
  return []
}
