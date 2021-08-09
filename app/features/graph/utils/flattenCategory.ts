import { Grasshopper } from 'glib'
import { ComponentLibrary } from '../types'

export const flattenCategory = (library: ComponentLibrary, category: string): Grasshopper.Component[] => {
  const bySubcategory = library[category]

  if (!bySubcategory) {
    return []
  }

  const flattened = Object.values(bySubcategory).reduce(
    (all, current) => [...all, ...current],
    [] as Grasshopper.Component[]
  )

  return flattened
}
