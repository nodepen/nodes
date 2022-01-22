import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { CameraState, CameraMode, CameraZoomLevel } from './types'

const initialState: CameraState = {
  mode: 'idle',
  zoom: {
    live: 1,
    static: 1,
    level: 'default',
  },
  lock: {
    pan: false,
    zoom: false,
  },
  position: {
    live: [0, 0],
    static: [0, 0],
  },
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
    setZoomLevel: (state, action: PayloadAction<CameraZoomLevel>) => {
      state.zoom.level = action.payload
    },
    setLivePosition: (state, action: PayloadAction<[number, number]>) => {
      state.position.live = action.payload
    },
    setStaticPosition: (state, action: PayloadAction<[number, number]>) => {
      state.position.static = action.payload
    },
  },
})

const selectCamera = (state: RootState): CameraState => state.camera
const selectCameraMode = (state: RootState): CameraMode => state.camera.mode
const selectCameraZoomLock = (state: RootState): boolean => state.camera.lock.zoom
const selectLiveZoom = (state: RootState): number => state.camera.zoom.live
const selectStaticZoom = (state: RootState): number => state.camera.zoom.static
const selectZoomLevel = (state: RootState): CameraZoomLevel => state.camera.zoom.level
const selectLivePosition = (state: RootState): [number, number] => state.camera.position.live
const selectStaticPosition = (state: RootState): [number, number] => state.camera.position.static

export const cameraSelectors = {
  selectCamera,
  selectCameraMode,
  selectCameraZoomLock,
  selectLiveZoom,
  selectStaticZoom,
  selectZoomLevel,
  selectLivePosition,
  selectStaticPosition,
}

const { actions, reducer } = cameraSlice

export const cameraActions = actions

export const cameraReducer = reducer
