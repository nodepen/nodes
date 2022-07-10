import type { RootState } from './state'
import { startTransition } from 'react'
import shallow from 'zustand/shallow'
import { useStore } from '$'

type BaseSetter = (callback: (state: RootState) => void) => void
type BaseGetter = () => RootState

export type RootDispatch = ReturnType<typeof createDispatch>

export const createDispatch = (set: BaseSetter, get: BaseGetter) => {
  const dispatch = {
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
    }),
    test: (id: string) => set((state) => {
      const node = state.document.nodes[id]

      if (!node) {
        return
      }

      node.position.x = node.position.x + 25
    })
  }

  return { dispatch }
}

export const useDispatch = () => {
  return useStore((state) => state.dispatch, shallow)
}