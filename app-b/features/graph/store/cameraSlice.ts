import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { CameraState, CameraMode } from './types'

const initialState: CameraState = {
  mode: 'idle',
  zoom: {
    live: 1,
    static: 1,
  },
  position: [0, 0],
}

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setCameraMode: (state, action: PayloadAction<CameraMode>) => {
      state.mode = action.payload
    },
    setLiveZoom: (state, action: PayloadAction<number>) => {
      state.zoom.live = action.payload
    },
    setStaticZoom: (state, action: PayloadAction<number>) => {
      state.zoom.static = action.payload
    },
    setPosition: (state, action: PayloadAction<[number, number]>) => {
      state.position = action.payload
    },
  },
})

const selectCamera = (state: RootState): CameraState => state.camera
const selectCameraMode = (state: RootState): CameraMode => state.camera.mode
const selectLiveZoom = (state: RootState): number => state.camera.zoom.live
const selectStaticZoom = (state: RootState): number => state.camera.zoom.static
const selectPosition = (state: RootState): [number, number] => state.camera.position

export const cameraSelectors = { selectCamera, selectCameraMode, selectLiveZoom, selectStaticZoom, selectPosition }

const { actions, reducer } = cameraSlice

export const cameraActions = actions

export const cameraReducer = reducer
