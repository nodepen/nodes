import { NodePen } from 'glib'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { GraphState } from './types'

const initialState: GraphState = {
  elements: {
    '001': {
      id: '001',
      template: {
        type: 'static-component',
      },
      current: {
        solution: {
          id: '',
          mode: 'deferred',
        },
        values: {},
        sources: {},
        anchors: {},
        position: [10, 10],
        dimensions: {
          width: 50,
          height: 50,
        },
      },
    },
    '002': {
      id: '002',
      template: {
        type: 'static-component',
      },
      current: {
        solution: {
          id: '',
          mode: 'deferred',
        },
        values: {},
        sources: {},
        anchors: {},
        position: [20, 20],
        dimensions: {
          width: 50,
          height: 50,
        },
      },
    },
    '003': {
      id: '003',
      template: {
        type: 'static-component',
      },
      current: {
        solution: {
          id: '',
          mode: 'deferred',
        },
        values: {},
        sources: {},
        anchors: {},
        position: [30, 30],
        dimensions: {
          width: 50,
          height: 50,
        },
      },
    },
    '004': {
      id: '004',
      template: {
        type: 'static-component',
      },
      current: {
        solution: {
          id: '',
          mode: 'deferred',
        },
        values: {},
        sources: {},
        anchors: {},
        position: [40, 40],
        dimensions: {
          width: 50,
          height: 50,
        },
      },
    },
  },
  selection: [],
}

type AddElementPayload<T extends NodePen.ElementType> = {
  type: T
  template: NodePen.Element<T>['template']
  position: [number, number]
}

type MoveElementPayload = {
  id: string
  position: [number, number]
}

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    addElement: (state: GraphState, action: PayloadAction<AddElementPayload<NodePen.ElementType>>) => {
      // TODO: Actual id generation
      const id = Math.round(Math.random() * 100).toString()

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

const selectElements = (state: RootState): NodePen.Element<NodePen.ElementType>[] => Object.values(state.graph.elements)

export const graphSelectors = { selectElements }

const { actions, reducer } = graphSlice

export const graphActions = actions

export const graphReducer = reducer
