import { Glasshopper } from 'glib'

export const getValueCount = (data: Glasshopper.Data.DataTree): number => {
  return Object.values(data).reduce((count, branch) => count + branch.length, 0)
}
