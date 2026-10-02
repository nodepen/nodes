import { create } from 'zustand'
import type { StoreApi, UseBoundStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { initialState } from './state'
import type { NodesAppState } from './state'
import { createDispatch } from './dispatch'
import type { NodesAppDispatch } from './dispatch'
import { setAutoFreeze } from 'immer'

export type NodesAppStore = NodesAppState & NodesAppDispatch

type NodesAppMiddleware = [['zustand/immer', never]]

setAutoFreeze(false)

export const useStore = create<NodesAppStore, NodesAppMiddleware>(
    immer((set, get) => ({
        ...initialState,
        ...createDispatch(set as any, get as any),
    }))
) as UseBoundStore<StoreApi<NodesAppStore>>

export const useCallbacks = () => {
    return useStore((state) => state.callbacks)
}
