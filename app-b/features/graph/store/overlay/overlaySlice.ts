import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { OverlayState, Payload } from './types'

const initialState: OverlayState = {
  show: {
    parameterMenu: false,
    tooltip: false,
  },
  parameterMenu: {
    source: {
      elementId: 'unset',
      parameterId: 'unset',
    },
    connection: {
      sourceType: 'input',
    },
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

          state.parameterMenu = {
            source: {
              elementId: sourceElementId,
              parameterId: sourceParameterId,
            },
            connection: {
              sourceType: 'input',
            },
          }
        }
      }
    },
    clear: (state: OverlayState) => {
      state.show = { ...initialState.show }
      state.parameterMenu = { ...initialState.parameterMenu }
    },
    setParameterMenuConnection: (
      state: OverlayState,
      action: PayloadAction<OverlayState['parameterMenu']['connection']>
    ) => {
      state.parameterMenu.connection = action.payload
    },
  },
})

const selectOverlayVisibility = (state: RootState): OverlayState['show'] => state.overlay.show
const selectParameterMenuSource = (state: RootState): OverlayState['parameterMenu']['source'] =>
  state.overlay.parameterMenu.source
const selectParameterMenuConnection = (state: RootState): OverlayState['parameterMenu']['connection'] =>
  state.overlay.parameterMenu.connection

export const overlaySelectors = {
  selectOverlayVisibility,
  selectParameterMenuSource,
  selectParameterMenuConnection,
}

const { actions, reducer } = overlaySlice

export const overlayActions = actions

export const overlayReducer = reducer
