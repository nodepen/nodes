import create from 'zustand'
import { immer as withImmer } from 'zustand/middleware/immer'
import { initialState } from './state'
import type { RootState } from './state'
import { createDispatch } from './dispatch'
import type { RootDispatch } from './dispatch'

export type RootStore = RootState & RootDispatch

type RootMiddleware = [
  ['zustand/immer', never]
]

export const useStore = create<RootStore, RootMiddleware>(
    withImmer(
      (set, get) => ({
        ...initialState,
        ...createDispatch(set, get)
      })
    )
  )