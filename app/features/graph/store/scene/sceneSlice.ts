import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { SceneState, DisplayMode } from './types'

const initialState: SceneState = {
  display: 'hide',
}

export const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    setDisplayMode: (state, action: PayloadAction<DisplayMode>) => {
      state.display = action.payload
    },
  },
})

const selectDisplayMode = (state: RootState): DisplayMode => state.scene.display

export const sceneSelectors = {
  selectDisplayMode,
}

const { actions, reducer } = sceneSlice

export const sceneActions = actions
export const sceneReducer = reducer
