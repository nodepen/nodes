import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { HotkeyState, Payload } from './types'
import { createSelector } from 'reselect'

const initialState: HotkeyState = {}

export const hotkeySlice = createSlice({
  name: 'hotkey',
  initialState,
  reducers: {
    setKey: (state: HotkeyState, action: PayloadAction<Payload.SetKeyPayload>) => {
      const { key, pressed } = action.payload

      const stateKey = key.toLowerCase()

      switch (stateKey) {
        case 'shift':
        case 'control':
        case 'a':
        case 'd':
        case 'y':
        case 'z':
          state[stateKey] = pressed
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
const selectShift = (state: RootState): boolean => !!state.hotkey['shift']
const selectControl = (state: RootState): boolean => !!state.hotkey['control']

const selectY = (state: RootState): boolean => !!state.hotkey['y']
const selectZed = (state: RootState): boolean => !!state.hotkey['z']

const selectHistoryHotkey = createSelector(selectControl, selectY, selectZed, (control, y, z) => {
  if (!control) {
    return undefined
  }

  if ([control, y, z].every((key) => key)) {
    return undefined
  }

  if (control && y) {
    return 'redo'
  }

  if (control && z) {
    return 'undo'
  }
})
const selectSelectionMode = createSelector(selectShift, selectControl, (shift, control) =>
  shift && control ? 'toggle' : shift ? 'add' : control ? 'remove' : 'default'
)
const selectWireMode = createSelector(selectShift, selectControl, (shift, control) =>
  shift && control ? 'transpose' : shift ? 'add' : control ? 'remove' : 'default'
)

export const hotkeySelectors = {
  selectHistoryHotkey,
  selectSelectionMode,
  selectWireMode,
}

const { actions, reducer } = hotkeySlice

export const hotkeyActions = actions

export const hotkeyReducer = reducer
