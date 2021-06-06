import { NodePen, assert } from 'glib'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { GraphState } from './types'
import { newGuid, initializeParameters } from '../../utils'
import {
  AddElementPayload,
  ConnectElementsPayload,
  MoveElementPayload,
  RegisterElementAnchorPayload,
  RegisterElementPayload,
} from './types/Payload'
import { GraphMode } from './types/GraphMode'

const initialState: GraphState = {
  elements: {},
  selection: [],
  mode: 'idle',
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
