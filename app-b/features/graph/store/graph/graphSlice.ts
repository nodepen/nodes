import { NodePen, assert } from 'glib'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { GraphState } from './types'
import { newGuid, initializeParameters, findAttachedWires } from '../../utils'
import {
  AddElementPayload,
  ConnectElementsPayload,
  MoveElementPayload,
  ProvisionalWirePayload,
  RegisterElementAnchorPayload,
  RegisterElementPayload,
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
        default: {
          break
        }
      }
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
          mode: 'item', // TODO: Check fromElement values
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
