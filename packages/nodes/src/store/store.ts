import { create } from 'zustand'
import { immer as withImmer } from 'zustand/middleware/immer'
import { initialState } from './state'
import type { NodesAppState } from './state'
import { createDispatch } from './dispatch'
import type { NodesAppDispatch } from './dispatch'

export type NodesAppStore = NodesAppState & NodesAppDispatch

type NodesAppMiddleware = [['zustand/immer', never]]

export const useStore = create<NodesAppStore, NodesAppMiddleware>(
  withImmer((set, get) => ({
    ...initialState,
    ...createDispatch(set, get),
  }))
)

export const useCallbacks = () => {
  return useStore((state) => state.callbacks)
}
