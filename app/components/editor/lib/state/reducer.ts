import { EditorAction, EditorStore } from '../types'

export const reducer = (state: EditorStore, action: EditorAction): EditorStore => {
  switch (action.type) {
    case 'camera/pan-camera': {
      const [dx, dy] = action.delta
      console.log(`${dx},${dy}`)
      return
    }
    case 'graph/add-component': {
      console.log(action.component)
      return
    }
  }
}
