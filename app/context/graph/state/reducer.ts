import { Glasshopper, Grasshopper } from 'glib'
import { GraphAction, GraphStore } from './../types'
import { newGuid } from '@/utils'

export const reducer = (state: GraphStore, action: GraphAction): GraphStore => {
  switch (action.type) {
    case 'demo': {
      return state
    }
    case 'session/register-socket': {
      const { socket, id } = action

      console.debug(`Registered socket connection ${id}.`)

      socket.on('join-session-handshake', (message: string) => {
        console.debug(message)
      })

      socket.emit('join-session', id)

      state.socket = {
        io: socket,
        id
      }

      return state
    }
    case 'session/load-components': {
      if (state.preflight.getLibrary) {
        return state
      }

      const { components } = action

      state.preflight.getLibrary = true

      components.forEach((component) => {
        const { category, subcategory } = component

        const libraryCategory = state.library[category.toLowerCase()]
        const librarySubcategory = subcategory.toLowerCase()

        if (!libraryCategory[librarySubcategory]) {
          libraryCategory[librarySubcategory] = []
        }

        libraryCategory[librarySubcategory].push(component)
      })

      return { ...state }
    }
    case 'session/restore-session': {
      state.preflight.getSession = true

      if (action.elements === 'none') {
        return { ...state }
      }

      const elements: { [key: string]: Glasshopper.Element.Base } = JSON.parse(action.elements)

      state.elements = elements

      return { ...state }
    }
    case 'session/set-ready': {
      state.ready = true
      return { ...state }
    }
    case 'graph/register-camera': {
      const { ref } = action

      state.camera.ref = ref

      return state
    }
    case 'graph/register-element': {
      const { ref, id } = action

      const element = state.elements[id]

      if (!element) {
        return state
      }

      const { width, height } = ref.current.getBoundingClientRect()

      element.current.dimensions = { width, height }

      return { ...state }
    }
    case 'graph/register-element-anchor': {
      const { elementId, anchorKey, position } = action

      // Position must be in page coordinate space
      const [x, y] = pageToGraphCoordinates(position, state)

      const element = state.elements[elementId]

      if (!element) {
        return state
      }

      if (!element.current.anchors) {
        element.current.anchors = {}
      }

      element.current.anchors[anchorKey] = [x, y]

      console.log(element)

      return state
    }
    case 'graph/add-component': {
      const { position, component: template } = action

      const component: Glasshopper.Element.StaticComponent = {
        id: newGuid(),
        template: { type: 'static-component', ...template },
        current: {
          position: pageToGraphCoordinates(position, state),
          dimensions: { width: 50, height: 50 },
          anchors: {},
          inputs: assignParameterInstanceIds(template.inputs),
          outputs: assignParameterInstanceIds(template.outputs),
          values: {}
        }
      }

      assignDefaultComponentValues(component)

      state.elements[component.id] = component

      // TODO: This is to limit data sent over the socket server. Find a better way.
      delete (state.elements[component.id] as Glasshopper.Element.StaticComponent).template.icon

      state.socket.io.emit('update-graph', JSON.stringify(state.elements))

      return { ...state }
    }
    case 'graph/add-parameter': {
      const { position, component: template } = action

      const parameter: Glasshopper.Element.StaticParameter = {
        id: newGuid(),
        template: { type: 'static-parameter', ...template },
        current: {
          position: pageToGraphCoordinates(position, state),
          dimensions: { width: 50, height: 50 },
          anchors: {},
          values: {}
        }
      }

      state.elements[parameter.id] = parameter

      // TODO: This is to limit data sent over the socket server. Find a better way.
      delete (state.elements[parameter.id] as Glasshopper.Element.StaticComponent).template.icon

      state.socket.io.emit('update-graph', JSON.stringify(state.elements))

      return { ...state }
    }
    case 'graph/selection-region': {
      const { from, to, partial } = action

      const [ax, ay] = pageToGraphCoordinates(from, state)
      const [bx, by] = pageToGraphCoordinates(to, state)

      const [minX, maxX] = [Math.min(ax, bx), Math.max(ax, bx)]
      const [minY, maxY] = [Math.min(ay, by), Math.max(ay, by)]

      const region = [[minX, minY], [maxX, maxY]] as [[number, number], [number, number]]

      const getElementExtents = (element: Glasshopper.Element.Base): [[number, number], [number, number]] => {
        const { width, height } = element.current.dimensions
        const [cx, cy] = element.current.position

        const [dx, dy] = [width / 2, height]

        const extents: [[number, number], [number, number]] = [
          [cx - dx, cy - dy],
          [cx + dx, cy]
        ]

        return extents
      }

      const isContained = (region: [[number, number], [number, number]], extents: [[number, number], [number, number]], partial: boolean = false): boolean => {
        const [[rMinX, rMinY], [rMaxX, rMaxY]] = region
        const [[eMinX, eMinY], [eMaxX, eMaxY]] = extents

        const wContained = (rMinX < eMinX && rMaxX > eMaxX)
        const wIntersect = (eMinX < rMinX && rMinX < eMaxX) || (eMinX < rMaxX && rMaxX < eMaxX)
        const hContained = (rMinY < eMinY && rMaxY > eMaxY)
        const hIntersect = (eMinY < rMinY && rMinY < eMaxY) || (eMinY < rMaxY && rMaxY < eMaxY)

        switch (partial) {
          case true: {
            // Capture if region at least crosses element
            return (wIntersect && hIntersect) || (wIntersect && hContained) || (hIntersect && wContained) || (wContained && hContained)
          }
          case false: {
            // Only capture if element totally enclosed by the region
            // return (rMinX < eMinX) && (rMinY < eMinY) && (rMaxX > eMaxX) && (rMaxY > eMaxY)
            return wContained && hContained
          }
        }
      }

      const captured = Object.values(state.elements).filter((element) => isContained(region, getElementExtents(element), partial)).map((element) => element.id)

      state.selected = captured

      return { ...state }
    }
    case 'graph/selection-add': {
      const { id } = action

      if (state.selected.includes(id)) {
        return state
      }

      state.selected.push(id)

      return { ...state }
    }
    case 'graph/selection-remove': {
      const { id } = action

      if (!state.selected.includes(id)) {
        return state
      }

      state.selected = state.selected.filter((elementId) => elementId !== id)

      return { ...state }
    }
    case 'graph/selection-toggle': {
      const { id } = action

      switch (state.selected.includes(id)) {
        case true: {
          state.selected = state.selected.filter((elementId) => elementId !== id)
        }
        case false: {
          state.selected.push(id)
        }
      }

      return { ...state }
    }
    case 'graph/selection-clear': {
      state.selected = []

      return { ...state }
    }
    case 'graph/wire/start-live-wire': {
      const { from, to, owner } = action

      const wire: Glasshopper.Element.LiveWire = {
        template: { type: 'live-wire' },
        current: {
          position: [0, 0],
          dimensions: { width: 0, height: 0 },
          anchors: {},
          from: pageToGraphCoordinates(from, state),
          to: pageToGraphCoordinates(to, state),
          owner,
          visible: true
        }
      }

      state.elements['live-wire'] = wire

      return { ...state }
    }
    case 'graph/wire/update-live-wire': {
      const { to } = action

      const next = pageToGraphCoordinates(to, state)

      const element = state.elements['live-wire'] as Glasshopper.Element.LiveWire

      element.current.to = next

      return { ...state }
    }
    case 'graph/wire/stop-live-wire': {
      const element = state.elements['live-wire'] as Glasshopper.Element.LiveWire

      element.current.visible = false

      return { ...state }
    }
    case 'graph/clear': {
      state.elements = {}

      state.socket.io.emit('update-graph', JSON.stringify(state.elements))

      return { ...state }
    }
    case 'camera/reset': {
      state.camera.position = [0, 0]

      return { ...state }
    }
    case 'camera/pan': {
      const { dx, dy } = action

      const [x, y] = state.camera.position

      state.camera.position = [x + dx, y + dy]

      return { ...state }
    }
  }
}

const pageToGraphCoordinates = (page: [number, number], state: GraphStore): [number, number] => {
  const [ex, ey] = page
  const [tx, ty] = state.camera.position
  const { width, height, top } = state.camera.ref.current.getBoundingClientRect()
  const [cx, cy] = [width / 2, (height / 2) + top]
  const [dx, dy] = [ex - cx, ey - cy]

  return [tx + dx, -(ty + dy)]
}

const assignParameterInstanceIds = (parameters: Grasshopper.ComponentParameter[]): { [key: string]: number } => {
  return parameters.reduce((map, next, i) => {
    map[newGuid()] = i
    return map
  }, {})
}

const assignDefaultComponentValues = (component: Glasshopper.Element.StaticComponent): void => {
  // TODO: Actually check for values
  [...Object.keys(component.current.inputs), ...Object.keys(component.current.outputs)].forEach((id) => {
    component.current.values[id] = {}
  })
}