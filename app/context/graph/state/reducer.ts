import { Glasshopper, Grasshopper } from 'glib'
import { GraphAction, GraphStore } from './../types'
import { newGuid } from '@/utils'

export const reducer = (state: GraphStore, action: GraphAction): GraphStore => {
  switch (action.type) {
    case 'demo': {
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
      const { elements } = action

      state.preflight.getSession = true

      state.elements = JSON.parse(elements)

      return { ...state }
    }
    case 'session/expire-solution': {
      expireSolution(state)
      return { ...state }
    }
    case 'session/declare-solution': {
      const { id } = action

      state.solution.id = id

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
          values: {},
          solution: { id: '', mode: 'deferred' },
        },
      }

      assignDefaultSources(component)
      assignDefaultComponentValues(component)

      state.elements[component.id] = component

      // TODO: This is to limit data sent over the socket server. Find a better way.
      delete (state.elements[component.id] as Glasshopper.Element.StaticComponent).template.icon

      expireSolution(state)

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
          values: {},
          solution: { id: '', mode: 'deferred' },
        },
      }

      assignDefaultSources(parameter)

      state.elements[parameter.id] = parameter

      // TODO: This is to limit data sent over the socket server. Find a better way.
      delete (state.elements[parameter.id] as Glasshopper.Element.StaticComponent).template.icon

      expireSolution(state)

      return { ...state }
    }
    case 'graph/add-panel': {
      const { position } = action

      const reference = state.library.params['input'].find((component) => component.name.toLowerCase() === 'panel')

      const panel: Glasshopper.Element.Panel = {
        id: newGuid(),
        template: { type: 'panel', ...reference },
        current: {
          position: pageToGraphCoordinates(position, state),
          dimensions: { width: 50, height: 50 },
          anchors: {},
          sources: { input: [] },
        },
      }

      state.elements[panel.id] = panel

      expireSolution(state)

      return { ...state }
    }
    case 'graph/selection-region': {
      const { from, to, partial } = action

      const [ax, ay] = pageToGraphCoordinates(from, state)
      const [bx, by] = pageToGraphCoordinates(to, state)

      const [minX, maxX] = [Math.min(ax, bx), Math.max(ax, bx)]
      const [minY, maxY] = [Math.min(ay, by), Math.max(ay, by)]

      const region = [
        [minX, minY],
        [maxX, maxY],
      ] as [[number, number], [number, number]]

      const getElementExtents = (element: Glasshopper.Element.Base): [[number, number], [number, number]] => {
        const { width, height } = element.current.dimensions
        const [cx, cy] = element.current.position

        const [dx, dy] = [width / 2, height]

        const extents: [[number, number], [number, number]] = [
          [cx - dx, cy - dy],
          [cx + dx, cy],
        ]

        return extents
      }

      const isContained = (
        region: [[number, number], [number, number]],
        extents: [[number, number], [number, number]],
        partial = false
      ): boolean => {
        const [[rMinX, rMinY], [rMaxX, rMaxY]] = region
        const [[eMinX, eMinY], [eMaxX, eMaxY]] = extents

        const wContained = rMinX < eMinX && rMaxX > eMaxX
        const wIntersect = (eMinX < rMinX && rMinX < eMaxX) || (eMinX < rMaxX && rMaxX < eMaxX)
        const hContained = rMinY < eMinY && rMaxY > eMaxY
        const hIntersect = (eMinY < rMinY && rMinY < eMaxY) || (eMinY < rMaxY && rMaxY < eMaxY)

        switch (partial) {
          case true: {
            // Capture if region at least crosses element
            return (
              (wIntersect && hIntersect) ||
              (wIntersect && hContained) ||
              (hIntersect && wContained) ||
              (wContained && hContained)
            )
          }
          case false: {
            // Only capture if element totally enclosed by the region
            // return (rMinX < eMinX) && (rMinY < eMinY) && (rMaxX > eMaxX) && (rMaxY > eMaxY)
            return wContained && hContained
          }
        }
      }

      const captured = Object.values(state.elements)
        .filter((element) => isContained(region, getElementExtents(element), partial))
        .map((element) => element.id)

      state.selected = captured

      localStorage.setItem('gh:selection', JSON.stringify(state.selected))

      return { ...state }
    }
    case 'graph/selection-add': {
      const { id } = action

      if (state.selected.includes(id)) {
        return state
      }

      state.selected.push(id)

      localStorage.setItem('gh:selection', JSON.stringify(state.selected))

      return { ...state }
    }
    case 'graph/selection-remove': {
      const { id } = action

      if (!state.selected.includes(id)) {
        return state
      }

      state.selected = state.selected.filter((elementId) => elementId !== id)

      localStorage.setItem('gh:selection', JSON.stringify(state.selected))

      return { ...state }
    }
    case 'graph/selection-toggle': {
      const { id } = action

      switch (state.selected.includes(id)) {
        case true: {
          state.selected = state.selected.filter((elementId) => elementId !== id)
          break
        }
        case false: {
          state.selected.push(id)
          break
        }
      }

      localStorage.setItem('gh:selection', JSON.stringify(state.selected))

      return { ...state }
    }
    case 'graph/selection-clear': {
      state.selected = []

      localStorage.setItem('gh:selection', JSON.stringify(state.selected))

      return { ...state }
    }
    case 'graph/config/set-execution-mode': {
      const { mode } = action

      state.config.executionMode = mode

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
            from: owner,
          },
          mode: 'thin',
        },
      }

      state.elements['live-wire'] = wire

      return { ...state }
    }
    case 'graph/wire/update-live-wire': {
      const { to } = action

      const element = state.elements['live-wire'] as Glasshopper.Element.Wire

      if (element.current.sources.to) {
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

      if (targetElement === sourceElement) {
        // Invalid claim. Wire cannot connect a component with itself.
        return state
      }

      const targetType = isInputOrOutput(targetElement, targetParameter, state)
      const sourceType = isInputOrOutput(sourceElement, sourceParameter, state)

      if (targetType === sourceType) {
        // Invalid claim. Wire cannot connect two inputs or two outputs.
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
          to: correctTo,
        }
      }

      // TODO: Verify connection does not already exist

      const wireId = newGuid()
      const wireToCommit = Object.assign({}, JSON.parse(JSON.stringify(element)), {
        id: wireId,
      }) as Glasshopper.Element.Wire

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
      expireSolution(state)

      return { ...state }
    }
    case 'graph/values/expire-solution': {
      const { newSolutionId } = action

      state.solution.id = newSolutionId

      console.log(`Awaiting solution ${newSolutionId}`)

      return { ...state }
    }
    case 'graph/values/prepare-solution': {
      const { status } = action

      console.log(`Solution ${state.solution.id} ready.`)

      if (state.solution.id !== status.solutionId) {
        // Result came for a solution we don't care about anymore, do nothing
        return state
      }

      const relevant = Object.values(state.elements).filter(
        (el) => el.template.type === 'static-parameter' || el.template.type === 'static-component'
      ) as (Glasshopper.Element.StaticComponent | Glasshopper.Element.StaticParameter)[]

      // Reset instance for new solution data
      relevant.forEach((el) => {
        el.current.solution.id = status.solutionId
        el.current.runtimeMessage = undefined
      })

      // Store new runtime messages
      status.runtimeMessages.forEach((msg) => {
        const { element, message, level } = msg

        const target = state.elements[element] as
          | Glasshopper.Element.StaticComponent
          | Glasshopper.Element.StaticParameter

        if (!target) {
          return
        }

        target.current.runtimeMessage = { message, level }
      })

      // TODO: Hash out a deferred solution strategy.
      const requireSolutions = relevant.filter((el) => el.current.solution.mode === 'deferred')

      const solutionRequests: Glasshopper.Payload.SolutionValueRequest[] = requireSolutions.reduce((requests, el) => {
        switch (el.template.type) {
          case 'static-parameter': {
            const request: Glasshopper.Payload.SolutionValueRequest = {
              solutionId: state.solution.id,
              elementId: el.id,
              parameterId: 'output',
            }

            return [...requests, request]
          }
          case 'static-component': {
            const component = el as Glasshopper.Element.StaticComponent

            const params = [...Object.keys(component.current.outputs), ...Object.keys(component.current.inputs)]

            const componentRequests: Glasshopper.Payload.SolutionValueRequest[] = params.map((id) => ({
              solutionId: state.solution.id,
              elementId: el.id,
              parameterId: id,
            }))

            return [...requests, ...componentRequests]
          }
        }
      }, [] as Glasshopper.Payload.SolutionValueRequest[])

      // state.socket.io.emit('solution-values', solutionRequests)

      return { ...state }
    }
    case 'graph/values/consume-solution-values': {
      const { values } = action

      const hasUserDefinedValues = (tree: Glasshopper.Data.DataTree): boolean => {
        const valueSources = Object.values(tree).reduce((froms, branch) => {
          const branchFroms = branch.reduce((all, value) => [...all, value.from], [] as string[])

          return [...froms, ...branchFroms]
        }, [] as string[])

        return valueSources.includes('user')
      }

      values.forEach((value) => {
        const {
          data,
          for: { solution, element, parameter },
        } = value

        if (state.solution.id !== solution) {
          return
        }

        const el = state.elements[element]

        if (!el) {
          return
        }

        switch (el.template.type) {
          case 'static-parameter': {
            const p = el as Glasshopper.Element.StaticParameter

            if (hasUserDefinedValues(p.current.values)) {
              console.debug(`Skipping solution for ${element} because it has user-defined values.`)
              p.current.solution.id = solution
              break
            }

            p.current.values = data
            p.current.solution.id = solution
            break
          }
          case 'static-component': {
            const e = el as Glasshopper.Element.StaticComponent

            e.current.values[parameter] = data
            e.current.solution.id = solution
            break
          }
        }
      })

      return { ...state }
    }
    case 'graph/values/consume-solution-messages': {
      const { messages } = action

      // Index messages by element id
      const messagesByElement: { [key: string]: { message: string; level: any } } = messages.reduce((all, msg) => {
        const { element, message, level } = msg

        all[element] = { message, level }

        return all
      }, {})

      // Assign new messages (or clear if it doesn't exist anymore)
      Object.keys(state.elements).forEach((id) => {
        const element = state.elements[id]

        const message = messagesByElement[id]

        switch (element.template.type) {
          case 'static-component': {
            const component = element as Glasshopper.Element.StaticComponent
            component.current.runtimeMessage = message
            break
          }
          case 'static-parameter': {
            const parameter = element as Glasshopper.Element.StaticParameter
            parameter.current.runtimeMessage = message
            break
          }
        }
      })

      return { ...state }
    }
    case 'graph/values/set-one-value': {
      const { targetElement, targetParameter, value } = action

      const data: Glasshopper.Data.DataTree = {
        '{0}': [{ from: 'user', type: 'number', data: Number.parseFloat(value) }],
      }

      if (targetParameter === 'input' || targetParameter === 'output') {
        // Target is a parameter, set data directly
        const el = state.elements[targetElement] as Glasshopper.Element.StaticParameter
        el.current.values = data
      } else {
        // Target is a component, navigate to parameter
        const el = state.elements[targetElement] as Glasshopper.Element.StaticComponent
        el.current.values[targetParameter] = data
      }

      expireSolution(state)

      return { ...state }
    }
    case 'graph/values/set-parameter-values': {
      const { solutionId, targetElement, targetParameter, values } = action

      if (targetParameter === 'input' || targetParameter === 'output') {
        const el = state.elements[targetElement] as Glasshopper.Element.StaticParameter

        el.current.solution.id = solutionId
        el.current.values = values
      } else {
        const el = state.elements[targetElement] as Glasshopper.Element.StaticComponent

        el.current.solution.id = solutionId
        el.current.values[targetParameter] = values
      }

      return { ...state }
    }
    case 'graph/clear': {
      state.elements = {}

      expireSolution(state)

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

const expireSolution = (state: GraphStore): void => {
  state.solution.id = newGuid()
}

const pageToGraphCoordinates = (page: [number, number], state: GraphStore): [number, number] => {
  const [ex, ey] = page
  const [tx, ty] = state.camera.position
  const { width, height, top } = state.camera.ref.current.getBoundingClientRect()
  const [cx, cy] = [width / 2, height / 2 + top]
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
  ;[...Object.keys(component.current.inputs), ...Object.keys(component.current.outputs)].forEach((id) => {
    component.current.values[id] = {}
  })
}

const assignDefaultSources = (
  element: Glasshopper.Element.StaticComponent | Glasshopper.Element.StaticParameter
): void => {
  switch (element.template.type) {
    case 'static-component': {
      const el = element as Glasshopper.Element.StaticComponent
      Object.keys(el.current.inputs).forEach((key) => (el.current.sources[key] = []))
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
