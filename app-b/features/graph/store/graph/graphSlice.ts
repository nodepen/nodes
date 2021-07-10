import { NodePen, assert } from 'glib'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { GraphState } from './types'
import { newGuid, initializeParameters, findAttachedWires } from '../../utils'
import {
  AddElementPayload,
  CaptureLiveWirePayload,
  ConnectElementsPayload,
  MoveElementPayload,
  ProvisionalWirePayload,
  RegisterElementAnchorPayload,
  RegisterElementPayload,
  StartLiveWirePayload,
  UpdateElementPayload,
  UpdateLiveWirePayload,
} from './types/Payload'
import { GraphMode } from './types/GraphMode'

const initialState: GraphState = {
  elements: {},
  selection: [],
  mode: 'idle',
  registry: {
    move: {
      elements: [],
      fromWires: [],
      toWires: [],
    },
    wire: {
      source: {
        type: 'input',
        elementId: 'unset',
        parameterId: 'unset',
      },
    },
  },
}

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    addElement: (state: GraphState, action: PayloadAction<AddElementPayload<NodePen.ElementType>>) => {
      const id = newGuid()

      switch (action.payload.type) {
        case 'static-component': {
          const template = action.payload.template as NodePen.Element<'static-component'>['template']

          const [sources, values, inputs, outputs] = initializeParameters(template)

          const element: NodePen.Element<'static-component'> = {
            id,
            template,
            current: {
              solution: {
                id: '',
                mode: 'deferred',
              },
              values,
              sources,
              anchors: {},
              position: action.payload.position,
              dimensions: {
                width: 50,
                height: 50,
              },
              inputs,
              outputs,
            },
          }

          state.elements[id] = element
          break
        }
        case 'region': {
          const template = action.payload.template as NodePen.Element<'region'>['template']

          const element: NodePen.Element<'region'> = {
            id,
            template,
            current: {
              dimensions: {
                width: 0,
                height: 0,
              },
              position: action.payload.position,
              from: [...action.payload.position],
              to: [...action.payload.position],
              selection: {
                mode: 'default',
              },
            },
          }

          state.elements[id] = element
          break
        }
        default: {
          break
        }
      }
    },
    deleteElement: (state: GraphState, action: PayloadAction<string>) => {
      if (!state.elements[action.payload]) {
        return
      }

      delete state.elements[action.payload]
    },
    moveElement: (state: GraphState, action: PayloadAction<MoveElementPayload>) => {
      const { id, position } = action.payload

      const element = state.elements[id]

      if (!element) {
        return
      }

      // Apply motion to connected wires
      const wires = Object.values(state.elements).filter((element) =>
        assert.element.isWire(element)
      ) as NodePen.Element<'wire'>[]

      const [fromWires, toWires] = findAttachedWires(wires, id)

      fromWires.forEach((wireId) => {
        const wire = state.elements[wireId]

        if (!assert.element.isWire(wire)) {
          return
        }

        const parameter = wire.template.from.parameterId

        const data = element.current

        if (!assert.element.isGripElement(data)) {
          return
        }

        const [x, y] = position
        const [dx, dy] = data.anchors[parameter]

        wire.current.from = [x + dx, y + dy]
      })

      toWires.forEach((wireId) => {
        const wire = state.elements[wireId]

        if (!assert.element.isWire(wire)) {
          return
        }

        const parameter = wire.template.to.parameterId

        const data = element.current

        if (!assert.element.isGripElement(data)) {
          return
        }

        const [x, y] = position
        const [dx, dy] = data.anchors[parameter]

        wire.current.to = [x + dx, y + dy]
      })

      // Apply motion to element
      element.current.position = position
    },
    updateLiveElement: (state: GraphState, action: PayloadAction<UpdateElementPayload<NodePen.ElementType>>) => {
      const { id, type, data } = action.payload

      const element = state.elements[id]

      // Make sure element exists
      if (!element) {
        console.log(`🐍 Attempted to update an element that doesn't exist!`)
        return
      }

      // Make sure element is of same type as incoming data
      switch (type) {
        case 'region': {
          if (!assert.element.isRegion(element)) {
            console.log(`🐍 Attempted to update a(n) ${element.template.type} with region data!`)
            return
          }

          const current = data as NodePen.Element<'region'>['current']

          element.current = { ...element.current, ...current }
          break
        }
        default: {
          console.log(`Update logic for ${type} elements not yet implemented. `)
          return
        }
      }
    },
    connect: (state: GraphState, action: PayloadAction<ConnectElementsPayload>) => {
      const { from, to } = action.payload

      const fromElement = state.elements[from.elementId] as NodePen.Element<'static-component'>
      const toElement = state.elements[to.elementId] as NodePen.Element<'static-component'>

      if (!fromElement) {
        console.debug(`🐍 Element ${from.elementId} declared for connection does not exist!`)
        return
      }

      if (!toElement) {
        console.debug(`🐍 Element ${to.elementId} declared for connection does not exist!`)
        return
      }

      // Check for existing connection
      const currentSources = toElement.current.sources[to.parameterId]

      if (
        currentSources.some(
          (source) => source.elementInstanceId === from.elementId && source.parameterInstanceId === from.parameterId
        )
      ) {
        console.debug(`🐍 Attempted to create a connection that already exists!`)
        return
      }

      currentSources.push({
        elementInstanceId: from.elementId,
        parameterInstanceId: from.parameterId,
      })

      const [xFrom, yFrom] = fromElement.current.position
      const [dxFrom, dyFrom] = fromElement.current.anchors[from.parameterId]

      const [xTo, yTo] = toElement.current.position
      const [dxTo, dyTo] = toElement.current.anchors[to.parameterId]

      const wireId = newGuid()

      const wire: NodePen.Element<'wire'> = {
        id: wireId,
        template: {
          type: 'wire',
          mode: 'data',
          from,
          to,
        },
        current: {
          from: [xFrom + dxFrom, yFrom + dyFrom],
          to: [xTo + dxTo, yTo + dyTo],
          position: [0, 0],
          dimensions: {
            width: 0,
            height: 0,
          },
        },
      }

      state.elements[wireId] = wire
    },
    startLiveWire: (state: GraphState, action: PayloadAction<StartLiveWirePayload>) => {
      const { type, elementId, parameterId } = action.payload

      state.registry.wire.capture = undefined

      state.registry.wire.source = {
        type,
        elementId,
        parameterId,
      }

      const sourceElement = state.elements[elementId]

      if (!sourceElement) {
        return
      }

      const sourceElementData = sourceElement.current

      if (!assert.element.isGripElement(sourceElementData)) {
        return
      }

      const [x, y] = sourceElementData.position
      const [dx, dy] = sourceElementData.anchors[parameterId]

      const [wx, wy] = [x + dx, y + dy]

      const wire: NodePen.Element<'wire'> = {
        id: 'live-wire',
        template: {
          type: 'wire',
          mode: 'live',
          from: {
            elementId: 'unset',
            parameterId: 'unset',
          },
          to: {
            elementId: 'unset',
            parameterId: 'unset',
          },
        },
        current: {
          from: [wx, wy],
          to: [wx, wy],
          position: [0, 0],
          dimensions: {
            width: 0,
            height: 0,
          },
        },
      }

      state.elements['live-wire'] = wire
    },
    updateLiveWire: (state: GraphState, action: PayloadAction<UpdateLiveWirePayload>) => {
      const { type, position } = action.payload

      const wire = state.elements['live-wire']

      if (!wire) {
        return
      }

      if (!assert.element.isWire(wire)) {
        return
      }

      if (state.registry.wire.capture) {
        // Wire is currently captured, don't move it
        return
      }

      wire.current[type] = position
    },
    captureLiveWire: (state: GraphState, action: PayloadAction<CaptureLiveWirePayload>) => {
      const { type, elementId, parameterId } = action.payload

      const wire = state.elements['live-wire']

      if (!wire) {
        // Cannot capture a wire that does not exist
        return
      }

      if (!assert.element.isWire(wire)) {
        return
      }

      if (type === state.registry.wire.source.type) {
        // Cannot attempt a connection between two inputs or two outputs
        return
      }

      if (elementId === state.registry.wire.source.elementId) {
        // Cannot attempt a connection to self
        return
      }

      if (elementId === state.registry.wire.capture?.elementId) {
        // No need to duplicate claim
        return
      }

      const element = state.elements[elementId]

      if (!element) {
        return
      }

      const elementData = element.current

      if (!assert.element.isGripElement(elementData)) {
        return
      }

      state.registry.wire.capture = { elementId, parameterId }

      const [x, y] = elementData.position
      const [dx, dy] = elementData.anchors[parameterId]

      wire.current[type === 'input' ? 'from' : 'to'] = [x + dx, y + dy]
    },
    releaseLiveWire: (state: GraphState) => {
      state.registry.wire.capture = undefined
    },
    endLiveWire: (state: GraphState) => {
      delete state.elements['live-wire']

      // Make connection if capture exists, otherwise stop connection attempt
      if (!state.registry.wire.capture) {
        return
      }

      const fromElementId =
        state.registry.wire.source.type === 'input'
          ? state.registry.wire.capture.elementId
          : state.registry.wire.source.elementId
      const fromParameterId =
        state.registry.wire.source.type === 'input'
          ? state.registry.wire.capture.parameterId
          : state.registry.wire.source.parameterId

      const toElementId =
        state.registry.wire.source.type === 'input'
          ? state.registry.wire.source.elementId
          : state.registry.wire.capture.elementId
      const toParameterId =
        state.registry.wire.source.type === 'input'
          ? state.registry.wire.source.parameterId
          : state.registry.wire.capture.parameterId

      const fromElement = state.elements[fromElementId] as NodePen.Element<'static-component'>
      const toElement = state.elements[toElementId] as NodePen.Element<'static-component'>

      if (!fromElement) {
        console.debug(`🐍 Element ${fromElementId} declared for connection does not exist!`)
        return
      }

      if (!toElement) {
        console.debug(`🐍 Element ${toElementId} declared for connection does not exist!`)
        return
      }

      const toElementData = toElement.current

      if (!assert.element.isGraphElement(toElementData)) {
        return
      }

      // Check for existing connection
      const currentSources = toElementData.sources[toParameterId]

      if (
        currentSources.some(
          (source) => source.elementInstanceId === fromElementId && source.parameterInstanceId === fromParameterId
        )
      ) {
        console.debug(`🐍 Attempted to create a connection that already exists!`)
        return
      }

      currentSources.push({
        elementInstanceId: fromElementId,
        parameterInstanceId: fromParameterId,
      })

      const [xFrom, yFrom] = fromElement.current.position
      const [dxFrom, dyFrom] = fromElement.current.anchors[fromParameterId]

      const [xTo, yTo] = toElement.current.position
      const [dxTo, dyTo] = toElement.current.anchors[toParameterId]

      const wireId = newGuid()

      const wire: NodePen.Element<'wire'> = {
        id: wireId,
        template: {
          type: 'wire',
          mode: 'data',
          from: {
            elementId: fromElementId,
            parameterId: fromParameterId,
          },
          to: {
            elementId: toElementId,
            parameterId: toParameterId,
          },
        },
        current: {
          from: [xFrom + dxFrom, yFrom + dyFrom],
          to: [xTo + dxTo, yTo + dyTo],
          position: [0, 0],
          dimensions: {
            width: 0,
            height: 0,
          },
        },
      }

      state.elements[wireId] = wire
    },
    setProvisionalWire: (state: GraphState, action: PayloadAction<ProvisionalWirePayload>) => {
      const { from, to } = action.payload

      const fromElement = state.elements[from.elementId]
      const toElement = state.elements[to.elementId]

      if (!fromElement || !toElement) {
        return
      }

      const fromElementData = fromElement.current
      const toElementData = toElement.current

      if (!assert.element.isGripElement(fromElementData) || !assert.element.isGripElement(toElementData)) {
        return
      }

      const [ax, ay] = fromElement.current.position
      const [adx, ady] = fromElementData.anchors[from.parameterId]

      const [bx, by] = toElement.current.position
      const [bdx, bdy] = toElementData.anchors[to.parameterId]

      const wire: NodePen.Element<'wire'> = {
        id: 'provisional-wire',
        template: {
          type: 'wire',
          mode: 'provisional',
          from,
          to,
        },
        current: {
          from: [ax + adx, ay + ady],
          to: [bx + bdx, by + bdy],
          position: [0, 0],
          dimensions: {
            width: 0,
            height: 0,
          },
        },
      }

      state.elements['provisional-wire'] = wire
    },
    clearProvisionalWire: (state: GraphState) => {
      delete state.elements['provisional-wire']
    },
    prepareLiveMotion: (state: GraphState, action: PayloadAction<string>) => {
      const targetId = action.payload

      // Given a target element that is about to move, cache information about
      // other live motion that must follow it.

      // TODO: Identify all selected elements

      // Identify all connected wires
      const wires = Object.values(state.elements).filter((element) =>
        assert.element.isWire(element)
      ) as NodePen.Element<'wire'>[]
      const [fromWires, toWires] = findAttachedWires(wires, targetId)

      state.registry.move.fromWires = fromWires
      state.registry.move.toWires = toWires

      // Note: we do not have to clean up the registry because it is always refreshed before it's needed
    },
    dispatchLiveMotion: (state: GraphState, action: PayloadAction<[dx: number, dy: number]>) => {
      // Apply live motion to all elements cached by `prepareLiveMotion`
      // All static actions at the end of the motion should succeed regardless of action here
      // (i.e. we should be able to 'skip' live frames)
      const [dx, dy] = action.payload

      const { fromWires, toWires } = state.registry.move

      fromWires.forEach((id) => {
        const wire = state.elements[id]

        if (!assert.element.isWire(wire)) {
          return
        }

        const [x, y] = wire.current.from

        wire.current.from = [x + dx, y + dy]
      })

      toWires.forEach((id) => {
        const wire = state.elements[id]

        if (!assert.element.isWire(wire)) {
          return
        }

        const [x, y] = wire.current.to

        wire.current.to = [x + dx, y + dy]
      })
    },
    setMode: (state: GraphState, action: PayloadAction<GraphMode>) => {
      const mode = action.payload

      state.mode = mode
    },
    registerElement: (state: GraphState, action: PayloadAction<RegisterElementPayload>) => {
      const { id, dimensions } = action.payload

      if (!state.elements[id]) {
        return
      }

      const [width, height] = dimensions

      state.elements[id].current.dimensions = { width, height }
    },
    registerElementAnchor: (state: GraphState, action: PayloadAction<RegisterElementAnchorPayload>) => {
      const { elementId, anchorId, position } = action.payload

      if (!state.elements[elementId]) {
        return
      }

      const { current } = state.elements[elementId]

      if (!assert.element.isGripElement(current)) {
        return
      }

      current.anchors[anchorId] = position
    },
  },
})

const selectElements = (state: RootState): { [id: string]: NodePen.Element<NodePen.ElementType> } =>
  state.graph.present.elements
const selectMode = (state: RootState): GraphMode => state.graph.present.mode

const selectGraphHistory = (state: RootState): { canUndo: boolean; canRedo: boolean } => {
  return {
    canUndo: state.graph.past.length > 0,
    canRedo: state.graph.future.length > 0,
  }
}

export const graphSelectors = { selectElements, selectMode, selectGraphHistory }

const { actions, reducer } = graphSlice

export const graphActions = actions

export const graphReducer = reducer
