import { Grasshopper } from 'glib'

export type GraphAction =
  | { type: 'demo' }
  | { type: 'lib/load-components', components: Grasshopper.Component[] }