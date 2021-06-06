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
      type: 'unset',
    },
    connection: {},
  },
}

export const overlaySlice = createSlice({
  name: 'overlay',
  initialState,
  reducers: {
    show: (state: OverlayState, action: PayloadAction<Payload.ShowPayload>) => {
      state.show = { ...initialState.show }

      switch (action.payload.menu) {
        case 'parameterMenu': {
          state.show.parameterMenu = true

          const { sourceElementId, sourceParameterId, sourceType } = action.payload

          state.parameterMenu = {
            source: {
              elementId: sourceElementId,
              parameterId: sourceParameterId,
              type: sourceType,
            },
            connection: {
              from:
                sourceType === 'output'
                  ? {
                      elementId: sourceElementId,
                      parameterId: sourceParameterId,
                    }
                  : undefined,
              to:
                sourceType === 'input'
                  ? {
                      elementId: sourceElementId,
                      parameterId: sourceParameterId,
                    }
                  : undefined,
            },
          }
        }
      }
    },
    clear: (state: OverlayState) => {
      state.show = { ...initialState.show }
      state.parameterMenu = { ...initialState.parameterMenu }
    },
    setParameterMenuConnection: (state: OverlayState, action: PayloadAction<Payload.ConnectionPayload>) => {
      const { type, elementId, parameterId } = action.payload

      if (state.parameterMenu.source.type === type) {
        // Cannot set same type as source type
        console.log('Incoming reference is of same type as source reference.')
        return
      }

      if (elementId === state.parameterMenu.source.elementId) {
        // Cannot set connection to same component
        console.log('Incoming reference is for same element as source reference.')
        return
      }

      state.parameterMenu.connection[type === 'input' ? 'to' : 'from'] = { elementId, parameterId }
    },
    clearParameterMenuConnection: (state: OverlayState) => {
      state.parameterMenu.connection = {}
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
