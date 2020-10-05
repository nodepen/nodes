import { Glasshopper } from '@/../lib/dist'
import { EditorAction, EditorStore } from '../types'
import { newGuid } from '@/utils'
import { Graph } from '../..'

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
    case 'graph/deselect-all': {
      state.graph.components.forEach((component) => {
        component.selected = false
      })

      return { ...state }
    }
    case 'graph/select-region': {
      const { from, to } = action

      const [ax, ay] = from
      const [bx, by] = to
      const [tx, ty] = state.camera.position

      const [minX, maxX] = [ax - tx, bx - tx].sort()
      const [minY, maxY] = [ay - ty, by - ty].sort()

      state.graph.components.forEach((component) => {
        const [cx, cy] = component.position

        // console.log(`${minX} < ${cx} < ${maxX}`)
        // console.log(`${minY} < ${-cy} < ${maxY}`)

        const isInXRange = cx > minX && cx < maxX
        const isInYRange = -cy > minY && -cy < maxY

        if (isInXRange && isInYRange) {
          component.selected = true
        }
      })
      return { ...state }
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
