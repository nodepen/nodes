import { Grasshopper } from 'glib'
import { ComponentLibrary } from '../types'

export const categorize = (library: Grasshopper.Component[]): ComponentLibrary => {
  const categorized = library.reduce((all, current) => {
    const category = current.category.toLowerCase()
    const subcategory = current.subcategory.toLowerCase()

    // If category does not exist yet, short-circuit
    if (!all[category]) {
      all[category] = { [subcategory]: [current] }
      return all
    }

    // If subcategory does not exist yet, short-circuit
    if (!all[category][subcategory]) {
      all[category][subcategory] = [current]
      return all
    }

    // Otherwise, append the component
    all[category][subcategory].push(current)
    return all
  }, {} as ComponentLibrary)

  return categorized
}
