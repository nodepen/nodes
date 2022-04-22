import create, {
  GetState,
  SetState,
  State,
  StateCreator,
  StoreApi,
} from 'zustand'
import { produce } from 'immer'
import type { Draft } from 'immer'
import React, { startTransition } from 'react'


const immer =
  <
    T extends State,
    CustomSetState extends SetState<T>,
    CustomGetState extends GetState<T>,
    CustomStoreApi extends StoreApi<T>
  >(
    config: StateCreator<
      T,
      (partial: ((draft: Draft<T>) => void) | T, replace?: boolean) => void,
      CustomGetState,
      CustomStoreApi
    >
  ): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        const nextState =
          typeof partial === 'function'
            ? produce(partial as (state: Draft<T>) => T)
            : (partial as T)
        return set(nextState, replace)
      },
      get,
      api
    )

type RootStore = typeof initialState & { setCameraPosition: (x: number, y: number) => void, setCameraZoom: (zoom: number) => void }

const initialState = {
  elements: {},
  camera: {
    /** container div innerWidth / innerHeight in screen space */
    aspect: 1.5,
    /** coordinates of center pixel in container div in graph space */
    position: {
      x: 0,
      y: 0,
    },
    /** ratio of screen space pixel to graph space unit */
    zoom: 0.5,
  },
  /** Collection of client-only references to meaningful dom elements */
  registry: {
    canvasRoot: React.createRef<HTMLDivElement>()
  }
}

export const useStore = create<RootStore>(
  immer((set, get) => ({
    ...initialState,
    setCameraAspect: (aspect: number) => set((state) => {
      state.camera.aspect = aspect
    }),
    setCameraPosition: (x: number, y: number) => set((state) => {
      startTransition(() => {
        state.camera.position.x = x
        state.camera.position.y = y
      })
    }),
    setCameraZoom: (zoom: number) => set((state) => {
      startTransition(() => {
        state.camera.zoom = zoom
      })
    })
  }))
)