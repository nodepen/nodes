import { Grasshopper } from '@/../lib'

export type EditorAction =
  | { type: 'camera/pan-camera'; delta: [number, number] }
  | { type: 'graph/add-component'; component: any }
  | { type: 'library/load-server-config'; components: Grasshopper.Component[] }
