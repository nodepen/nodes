import { configureStore } from '@reduxjs/toolkit'
import { cameraReducer } from 'features/graph/store'

export const store = configureStore({
  reducer: {
    camera: cameraReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type RootDispatch = typeof store.dispatch
