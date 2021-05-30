import { configureStore } from '@reduxjs/toolkit'
import { cameraReducer } from 'features/graph/store'
import { graphReducer } from 'features/graph/store'
import undoable from 'redux-undo'

export const store = configureStore({
  reducer: {
    camera: cameraReducer,
    graph: undoable(graphReducer),
  },
})

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch
