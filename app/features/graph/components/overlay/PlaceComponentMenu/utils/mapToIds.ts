import { Grasshopper } from 'glib'

export const mapToIds = (library: Grasshopper.Component[]): { [id: string]: Grasshopper.Component } => {
  return library.reduce((mapped, current) => ({ ...mapped, [current.guid]: current }), {})
}
