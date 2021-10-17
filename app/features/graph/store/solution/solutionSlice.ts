import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '$'
import { SolutionState } from './types'
import { createSelector } from 'reselect'

const initialState: SolutionState = {}

export const solutionSlice = createSlice({
    name: 'solution',
    initialState,
    reducers: {

    }
})

