import React, { createContext } from 'react'
import { reducer } from './reducer'
import { EditorStore, EditorAction } from '../types'

export const initialState: EditorStore = {
  graph: {
    components: [{ component: {} as any, position: [0, -115], selected: false, id: 'test' }],
    wires: [],
  },
  selection: {
    components: [],
  },
  library: {
    components: [],
  },
  camera: {
    position: [0, 0],
  },
}

export const store = createContext<{
  state: EditorStore
  dispatch: React.Dispatch<EditorAction>
}>({
  state: initialState,
  dispatch: reducer as any,
})
