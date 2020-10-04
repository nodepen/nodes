export type EditorAction =
  | { type: 'camera/pan-camera'; delta: [number, number] }
  | { type: 'graph/add-component'; component: any }
