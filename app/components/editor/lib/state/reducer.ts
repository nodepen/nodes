import { Glasshopper } from '@/../lib/dist'
import { EditorAction, EditorStore } from '../types'
import { newGuid } from '@/utils'

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
      const { component, position } = action

      // ( Chuck ) Component position is page position on create
      const [cx, cy] = position
      const [tx, ty] = state.camera.position

      const newComponent: Glasshopper.Component = {
        component: component,
        position: [cx - tx, -cy + ty],
        selected: false,
        id: newGuid(),
      }

      const graph = { ...state.graph, components: [...state.graph.components, newComponent] }

      return { ...state, graph }
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
