import { NodePen, assert } from 'glib'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { GraphState } from './types'
import { newGuid, initializeParameters } from '../../utils'
import {
  AddElementPayload,
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
      // TODO: Actual id generation
      const id = newGuid()

      switch (action.payload.type) {
        case 'static-component': {
          const template = action.payload.template as NodePen.Element<'static-component'>['template']

          const element: NodePen.Element<'static-component'> = {
            id,
            template,
            current: {
              solution: {
                id: '',
                mode: 'deferred',
              },
              values: {},
              sources: {},
              anchors: {},
              position: action.payload.position,
              dimensions: {
                width: 50,
                height: 50,
              },
              inputs: initializeParameters(template.inputs),
              outputs: initializeParameters(template.outputs),
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

      if (!state.elements[id]) {
        return
      }

      state.elements[id].current.position = position
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
