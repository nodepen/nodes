import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { Payload, SolutionState } from './types'

const initialState: SolutionState = {
  meta: {},
  values: {},
  messages: {},
}

export const solutionSlice = createSlice({
  name: 'solution',
  initialState,
  reducers: {
    expireSolution: (state: SolutionState) => {
      // Flag current solution as expired
      state.meta.id = undefined
      state.meta.phase = 'expired'
      state.meta.error = undefined
      state.meta.duration = 0

      // Delete any stored values
      state.values = {}
      state.messages = {}
    },
    updateSolution: (state: SolutionState, action: PayloadAction<Payload.UpdateSolutionPayload>) => {
      const { meta, messages } = action.payload

      state.meta = { ...state.meta, ...meta }
      state.messages = messages ?? {}
    },
  },
})

const selectCurrentSolutionId = (state: RootState): string | undefined => state.solution.meta.id
const selectCurrentSolutionPhase = (state: RootState): SolutionState['meta']['phase'] => state.solution.meta.phase
const selectCurrentSolutionValues = (state: RootState): SolutionState['values'] => state.solution.values
const selectCurrentSolutionMessages = (state: RootState): SolutionState['messages'] => state.solution.messages

export const solutionSelectors = {
  selectCurrentSolutionId,
  selectCurrentSolutionPhase,
  selectCurrentSolutionValues,
  selectCurrentSolutionMessages,
}

const { actions, reducer } = solutionSlice

export const solutionActions = actions

export const solutionReducer = reducer
