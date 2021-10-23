import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { Payload, SolutionState } from './types'

const initialState: SolutionState = {
  current: {
    solutionId: '',
  },
  data: {},
}

export const solutionSlice = createSlice({
  name: 'solution',
  initialState,
  reducers: {
    expireSolution: (state: SolutionState, action: PayloadAction<Payload.ExpireSolutionPayload>) => {
      const { current, data } = state
      const { id: newSolutionId } = action.payload

      // Remove current values
      delete data[current.solutionId]

      // Assign new generation
      current.solutionId = newSolutionId
      data.solutionId = {}
    },
  },
})

const selectCurrentSolutionId = (state: RootState): string => state.solution.current.solutionId
const selectCurrentSolutionValues = (state: RootState): SolutionState['data'][''] =>
  state.solution.data[state.solution.current.solutionId]

export const solutionSelectors = {
  selectCurrentSolutionId,
  selectCurrentSolutionValues,
}

const { actions, reducer } = solutionSlice

export const solutionActions = actions

export const solutionReducer = reducer
