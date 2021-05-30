import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { CameraState, CameraMode } from './types'

const initialState: CameraState = {
  mode: 'idle',
  zoom: {
    live: 1,
    static: 1,
  },
  lock: {
    pan: false,
    zoom: false,
  },
  position: [0, 0],
  registry: {},
}

export const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setCameraMode: (state, action: PayloadAction<CameraMode>) => {
      state.mode = action.payload
    },
    setCameraZoomLock: (state, action: PayloadAction<boolean>) => {
      state.lock.zoom = action.payload
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
    registerMoveTo: (state, action: PayloadAction<CameraState['registry']['moveTo']>) => {
      state.registry.moveTo = action.payload
    },
  },
})

const selectCamera = (state: RootState): CameraState => state.camera
const selectCameraMode = (state: RootState): CameraMode => state.camera.mode
const selectCameraZoomLock = (state: RootState): boolean => state.camera.lock.zoom
const selectLiveZoom = (state: RootState): number => state.camera.zoom.live
const selectStaticZoom = (state: RootState): number => state.camera.zoom.static
const selectPosition = (state: RootState): [number, number] => state.camera.position

const selectRegistry = (state: RootState): CameraState['registry'] => state.camera.registry

export const cameraSelectors = {
  selectCamera,
  selectCameraMode,
  selectCameraZoomLock,
  selectLiveZoom,
  selectStaticZoom,
  selectPosition,
  selectRegistry,
}

const { actions, reducer } = cameraSlice

export const cameraActions = actions

export const cameraReducer = reducer
