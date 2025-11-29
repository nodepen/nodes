import { create } from 'zustand'
import type { StoreApi, UseBoundStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { initialState } from './state'
import type { NodesAppState } from './state'
import { createDispatch } from './dispatch'
import type { NodesAppDispatch } from './dispatch'

export type NodesAppStore = NodesAppState & NodesAppDispatch

type NodesAppMiddleware = [['zustand/immer', never]]

export const useStore: UseBoundStore<StoreApi<NodesAppStore>> = create<NodesAppStore, NodesAppMiddleware>(
  immer((set, get) => ({
    ...initialState,
    ...createDispatch(set, get),
  }))
)

export const useCallbacks = () => {
  return useStore((state) => state.callbacks)
}
