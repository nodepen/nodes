import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { HotkeyState, Payload } from './types'
import { createSelector } from 'reselect'

const initialState: HotkeyState = {
  Shift: false,
  Control: false,
}

export const hotkeySlice = createSlice({
  name: 'hotkey',
  initialState,
  reducers: {
    setKey: (state: HotkeyState, action: PayloadAction<Payload.SetKeyPayload>) => {
      const { key, pressed } = action.payload

      switch (key) {
        case 'Shift':
        case 'Control':
          state[key] = pressed
          break
        default:
          if (process.env.NEXT_PUBLIC_DEBUG) {
            console.log(`😔😔😔 Not observing ${key}`)
          }
      }
    },
  },
})

// const selectSpace = (state: RootState): boolean => !!state.hotkey['Space']
const selectShift = (state: RootState): boolean => !!state.hotkey['Shift']
const selectControl = (state: RootState): boolean => !!state.hotkey['Control']

const selectWireMode = createSelector(selectShift, selectControl, (shift, control) =>
  shift && control ? 'default' : shift ? 'add' : control ? 'remove' : 'default'
)

const selectWireStartMode = createSelector(selectShift, selectControl, (shift, control) =>
  shift && control ? 'transpose' : shift ? 'add' : control ? 'remove' : 'default'
)

export const hotkeySelectors = {
  selectWireMode,
  selectWireStartMode,
}

const { actions, reducer } = hotkeySlice

export const hotkeyActions = actions

export const hotkeyReducer = reducer
