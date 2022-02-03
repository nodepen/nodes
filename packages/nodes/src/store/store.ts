import create from 'zustand'
import type { GraphState } from './types'

type RootStore = typeof initialState

const initialState: GraphState = {
  elements: {}
}

export const useStore = create<RootStore>((get, set) => ({
  ...initialState,
}))