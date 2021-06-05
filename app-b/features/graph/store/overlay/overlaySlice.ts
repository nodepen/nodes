import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { OverlayState, Payload } from './types'

const initialState: OverlayState = {
  show: {
    parameterMenu: false,
    tooltip: false,
  },
  parameterMenu: {
    sourceElementId: 'unset',
    sourceParameterId: 'unset',
  },
}

export const overlaySlice = createSlice({
  name: 'overlay',
  initialState,
  reducers: {
    show: (state: OverlayState, action: PayloadAction<Payload.ShowPayload>) => {
      state.show = { ...initialState.show }

      switch (action.payload.type) {
        case 'parameterMenu': {
          state.show.parameterMenu = true

          const { sourceElementId, sourceParameterId } = action.payload

          state.parameterMenu = { sourceElementId, sourceParameterId }
        }
      }
    },
    clear: (state: OverlayState) => {
      console.log('clear!')
      state.show = { ...initialState.show }
    },
  },
})

const selectOverlayVisibility = (state: RootState): OverlayState['show'] => state.overlay.show
const selectParameterMenu = (state: RootState): OverlayState['parameterMenu'] => state.overlay.parameterMenu

export const overlaySelectors = {
  selectOverlayVisibility,
  selectParameterMenu,
}

const { actions, reducer } = overlaySlice

export const overlayActions = actions

export const overlayReducer = reducer
