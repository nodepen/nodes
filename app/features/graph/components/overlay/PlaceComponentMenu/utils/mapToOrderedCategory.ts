import { Grasshopper } from 'glib'
import { order } from '../data'
import { mapToCategory } from './mapToCategory'

export const mapToOrderedCategory = (
  library: Grasshopper.Component[]
): [category: string, components: Grasshopper.Component[]][] => {
  const categorized = mapToCategory(library)

  return order.reduce((all, category) => {
    return categorized[category] ? [...all, [category, categorized[category]]] : all
  }, [] as [category: string, components: Grasshopper.Component[]][])
}
