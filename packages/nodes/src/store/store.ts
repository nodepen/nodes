import create from 'zustand'
import { withImmer } from './middleware'
import { initialState } from './state'
import type { RootState } from './state'
import { createDispatch } from './dispatch'
import type { RootDispatch } from './dispatch'

type RootStore = RootState & RootDispatch

export const useStore = create<RootStore>(
  withImmer((set, get) => ({
    ...initialState,
    ...createDispatch(set, get)
  }))
)