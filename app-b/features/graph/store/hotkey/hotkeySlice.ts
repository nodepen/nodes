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

      const watched = ['Space', 'Control', 'Shift']

      if (!watched.includes(key)) {
        console.log(`Not observing ${key}.`)
        return
      }

      state[key] = pressed
    },
  },
})

// const selectSpace = (state: RootState): boolean => !!state.hotkey['Space']
const selectShift = (state: RootState): boolean => !!state.hotkey['Shift']
const selectControl = (state: RootState): boolean => !!state.hotkey['Control']

const selectWireMode = createSelector(selectShift, selectControl, (shift, control) =>
  shift ? 'add' : control ? 'remove' : 'default'
)

export const hotkeySelectors = {
  selectWireMode,
}

const { actions, reducer } = hotkeySlice

export const hotkeyActions = actions

export const hotkeyReducer = reducer
