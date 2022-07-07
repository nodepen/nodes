import type { BaseSetter, BaseGetter } from '$'
import { startTransition } from 'react'

export const createDispatch = (set: BaseSetter, get: BaseGetter) => {
    return {
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
          const element = state.document.elements[id]

          if (!element) {
            return
          }

          element.position.x = element.position.x + 25
        })
    }
}

export type CameraDispatch = ReturnType<typeof createDispatch>