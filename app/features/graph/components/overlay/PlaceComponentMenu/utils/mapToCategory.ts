import { Grasshopper } from 'glib'

export const mapToCategory = (library: Grasshopper.Component[]): { [category: string]: Grasshopper.Component[] } => {
  return library.reduce((grouped, current) => {
    const { category } = current

    const key = category.toLowerCase()

    if (!grouped[key]) {
      grouped[key] = []
    }

    grouped[key].push(current)

    return grouped
  }, {} as { [category: string]: Grasshopper.Component[] })
}
