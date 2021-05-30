import { NodePen } from 'glib'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { GraphState } from './types'
import { newGuid } from '../utils'
import { AddElementPayload, MoveElementPayload } from './types/Payload'

const initialState: GraphState = {
  elements: {
    // '001': {
    //   id: '001',
    //   template: {
    //     type: 'static-component',
    //   } as any,
    //   current: {
    //     solution: {
    //       id: '',
    //       mode: 'deferred',
    //     },
    //     values: {},
    //     sources: {},
    //     anchors: {},
    //     position: [0, 0],
    //     dimensions: {
    //       width: 50,
    //       height: 50,
    //     },
    //   },
    // },
    // '002': {
    //   id: '002',
    //   template: {
    //     type: 'static-component',
    //   } as any,
    //   current: {
    //     solution: {
    //       id: '',
    //       mode: 'deferred',
    //     },
    //     values: {},
    //     sources: {},
    //     anchors: {},
    //     position: [50, 50],
    //     dimensions: {
    //       width: 50,
    //       height: 50,
    //     },
    //   },
    // },
    // '003': {
    //   id: '003',
    //   template: {
    //     type: 'static-component',
    //   } as any,
    //   current: {
    //     solution: {
    //       id: '',
    //       mode: 'deferred',
    //     },
    //     values: {},
    //     sources: {},
    //     anchors: {},
    //     position: [25, 50],
    //     dimensions: {
    //       width: 50,
    //       height: 50,
    //     },
    //   },
    // },
    // '004': {
    //   id: '004',
    //   template: {
    //     type: 'static-component',
    //   } as any,
    //   current: {
    //     solution: {
    //       id: '',
    //       mode: 'deferred',
    //     },
    //     values: {},
    //     sources: {},
    //     anchors: {},
    //     position: [-50, -50],
    //     dimensions: {
    //       width: 50,
    //       height: 50,
    //     },
    //   },
    // },
  },
  selection: [],
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
  },
})

const selectElements = (state: RootState): { [id: string]: NodePen.Element<NodePen.ElementType> } =>
  state.graph.elements

export const graphSelectors = { selectElements }

const { actions, reducer } = graphSlice

export const graphActions = actions

export const graphReducer = reducer
