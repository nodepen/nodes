import type { NodesAppState } from './state'
import { startTransition } from 'react'
import type * as NodePen from '@nodepen/core'
import shallow from 'zustand/shallow'
import { useStore } from '$'

type BaseAction = string | ({ type: string } &  Record<string, unknown>)
type BaseSetter = (callback: (state: NodesAppState) => void, replace?: boolean, action?: BaseAction) => void
type BaseGetter = () => NodesAppState

export type NodesAppDispatch = ReturnType<typeof createDispatch>

export const createDispatch = (set: BaseSetter, get: BaseGetter) => {
  const dispatch = {
    apply: (callback: (state: NodesAppState, get: BaseGetter) => void) => set((state) => callback(state, get)),
    loadTemplates: (templates: NodePen.NodeTemplate[]) => set(
      (state) => {
        state.templates = {}

        for (const template of templates) {
          state.templates[template.guid] = template
        }
      },
      false,
      'templates/loadTemplates'
    ),
    setCameraAspect: (aspect: number) => set(
      (state) => {
        state.camera.aspect = aspect
      },
      false,
      'camera/setAspect'
    ),
    setCameraPosition: (x: number, y: number) => set(
      (state) => {
        startTransition(() => {
          state.camera.position.x = x
          state.camera.position.y = y
        })
      },
      false,
      'camera/setPosition'
    ),
    setCameraZoom: (zoom: number) => set(
      (state) => {
        startTransition(() => {
          state.camera.zoom = zoom
        })
      },
      false,
      'camera/setZoom'
    ),
    setNodePosition: (id: string, x: number, y: number) => set(
      (state) => {
        const node = state.document.nodes[id]

        if (!node) {
          return
        }

        startTransition(() => {
          node.position.x = x
          node.position.y = y
        })
      },
      false,
      {
        type: 'node/setPosition',
        payload: { id, x, y }
      }
    )
  }

  return { dispatch }
}

export const useDispatch = () => {
  return useStore((state) => state.dispatch, shallow)
}