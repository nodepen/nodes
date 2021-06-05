import { configureStore } from '@reduxjs/toolkit'
import { overlayReducer } from 'features/graph/store/overlay'
import { cameraReducer } from 'features/graph/store/camera'
import { graphReducer } from 'features/graph/store/graph'
import undoable from 'redux-undo'

export const store = configureStore({
  reducer: {
    camera: cameraReducer,
    graph: undoable(graphReducer),
    overlay: overlayReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch
