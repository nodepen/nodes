import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { CameraState } from './types'

const initialState: CameraState = {
  zoom: 1,
  position: [0, 0],
}

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload
    },
    setPosition: (state, action: PayloadAction<[number, number]>) => {
      state.position = action.payload
    },
  },
})

const selectZoom = (state: RootState): number => state.camera.zoom
const selectPosition = (state: RootState): [number, number] => state.camera.position

export const cameraSelectors = { selectZoom, selectPosition }

const { actions, reducer } = cameraSlice

export const cameraActions = actions

export const cameraReducer = reducer
