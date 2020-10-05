import { EditorAction, EditorStore } from '../types'

export const reducer = (state: EditorStore, action: EditorAction): EditorStore => {
  switch (action.type) {
    case 'camera/pan-camera': {
      const [dx, dy] = action.delta
      const [x, y] = state.camera.position

      const camera = { position: [x + dx, y + dy] as [number, number] }

      const next = { ...state, camera }

      return next
    }
    case 'graph/add-component': {
      console.log(action.component)
      return state
    }
    case 'library/load-server-config': {
      // Extract arguments
      const { components } = action

      // Generate new library property
      const library = { components }

      // Merge library with current state
      const next = { ...state, library }

      return next
    }
  }
}
