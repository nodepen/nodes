import { Grasshopper } from 'glib'

export type ComponentLibrary = {
  [category: string]: {
    [subcategory: string]: Grasshopper.Component[]
  }
}
