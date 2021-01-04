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

      if (!element || !element.current.anchors) {
        console.log(`Tried to register ${anchorKey} on non-existing element.`)
        return state
      }

      element.current.anchors[anchorKey] = [x, y]

      return { ...state }
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
          sources: {},
          values: {}
        }
      }

      assignDefaultSources(component)
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
          sources: {},
          values: {}
        }
      }

      assignDefaultSources(parameter)

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

      const wire: Glasshopper.Element.Wire = {
        id: 'live-wire',
        template: { type: 'wire' },
        current: {
          position: [0, 0],
          dimensions: { width: 0, height: 0 },
          anchors: {},
          from: pageToGraphCoordinates(from, state),
          to: pageToGraphCoordinates(to, state),
          sources: {
            from: owner
          },
          mode: 'thin'
        }
      }

      state.elements['live-wire'] = wire

      return { ...state }
    }
    case 'graph/wire/update-live-wire': {
      const { to } = action

      const element = state.elements['live-wire'] as Glasshopper.Element.Wire

      if (!!element.current.sources.to) {
        // A claim has been snapped to, do not move the wire
        return state
      }

      const next = pageToGraphCoordinates(to, state)
      element.current.to = next

      return { ...state }
    }
    case 'graph/wire/capture-live-wire': {
      const { targetElement, targetParameter } = action

      const wire = state.elements['live-wire'] as Glasshopper.Element.Wire

      if (!wire || !wire.current.sources.from) {
        return state
      }

      // Source for live wire will always be in 'from'
      // We swap from-to on commit if necessary
      const { element: sourceElement, parameter: sourceParameter } = wire.current.sources.from

      const targetType = isInputOrOutput(targetElement, targetParameter, state)
      const sourceType = isInputOrOutput(sourceElement, sourceParameter, state)

      if (targetType === sourceType) {
        // Invalid claim. (i.e. input claiming and input source)
        return state
      }

      // Assign new claim
      wire.current.sources.to = { element: targetElement, parameter: targetParameter }

      // Update position to claim
      wire.current.to = state.elements[targetElement].current.anchors[targetParameter]

      return { ...state }
    }
    case 'graph/wire/release-live-wire': {
      const { targetElement, targetParameter } = action

      const wire = state.elements['live-wire'] as Glasshopper.Element.Wire

      if (!wire || !wire.current.sources.from) {
        return state
      }

      if (wire.current.mode === 'hidden' || !wire.current.sources.to) {
        return state
      }

      const claimant = wire.current.sources.to

      if (claimant.element !== targetElement || claimant.parameter !== targetParameter) {
        // Claim already released, do no work
        return state
      }

      wire.current.sources.to = undefined

      return { ...state }
    }
    case 'graph/wire/stop-live-wire': {
      const element = state.elements['live-wire'] as Glasshopper.Element.Wire

      console.log(element)

      if (!element.current.sources.from || !element.current.sources.to) {
        // Wire did not make a connection, kill it with fire
        element.current.mode = 'hidden'
        element.current.sources = {}
        return { ...state }
      }

      const from = element.current.sources.from
      const to = element.current.sources.to

      // Wire did make a connection, commit it as an element
      const sourceType = isInputOrOutput(from.element, from.parameter, state)

      if (sourceType === 'input') {
        // Wire elements expect the 'from' source to be an output, swap current claims
        const correctFrom = { ...to }
        const correctTo = { ...from }

        element.current.sources = {
          from: correctFrom,
          to: correctTo
        }
      }

      // TODO: Verify connection does not already exist

      const wireId = newGuid()
      const wireToCommit = Object.assign({}, JSON.parse(JSON.stringify(element)), { id: wireId }) as Glasshopper.Element.Wire

      // Add new wire
      state.elements[wireId] = wireToCommit

      // Clear live wire
      element.current.mode = 'hidden'
      element.current.sources = {}

      // Update sources in target
      const source = wireToCommit.current.sources.from
      const target = wireToCommit.current.sources.to

      const sourceElement = state.elements[target.element] as Glasshopper.Element.StaticComponent

      sourceElement.current.sources[target.parameter].push({ element: source.element, parameter: source.parameter })

      // Commit new graph to db
      state.socket.io.emit('update-graph', JSON.stringify(state.elements))

      return { ...state }
    }
    case 'graph/values/set-one-value': {
      const { targetElement, targetParameter, value } = action

      const data = { '{0}': [value] }

      const el = state.elements[targetElement] as Glasshopper.Element.StaticParameter

      el.current.values = data

      state.socket.io.emit('update-graph', JSON.stringify(state.elements))

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

const assignDefaultSources = (element: Glasshopper.Element.StaticComponent | Glasshopper.Element.StaticParameter): void => {
  switch (element.template.type) {
    case 'static-component': {
      const el = element as Glasshopper.Element.StaticComponent
      Object.keys(el.current.inputs).forEach((key) => el.current.sources[key] = [])
      return
    }
    case 'static-parameter': {
      element.current.sources['input'] = []
    }
  }
}

const isInputOrOutput = (elementId: string, parameterId: string, state: GraphStore): 'input' | 'output' => {
  const element = state.elements[elementId]

  if (element.template.type === 'static-parameter') {
    return parameterId as 'input' | 'output'
  }

  if (element.template.type === 'static-component') {
    const el = element as Glasshopper.Element.StaticComponent

    if (Object.keys(el.current.inputs).includes(parameterId)) {
      return 'input'
    }

    if (Object.keys(el.current.outputs).includes(parameterId)) {
      return 'output'
    }
  }

  console.log('isInputOrOutput used incorrectly!')
  return 'input'
}