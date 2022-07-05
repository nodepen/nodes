import create from 'zustand'
import type {
  GetState,
  SetState,
  State,
  StateCreator,
  StoreApi,
} from 'zustand'
import React, { startTransition } from 'react'
import type * as NodePen from '@nodepen/core'
import { produce } from 'immer'
import type { Draft } from 'immer'
import * as camera from './camera'
import type { CameraDispatch, CameraState } from './camera'

export const immer = <
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

export type BaseSetter =  (callback: (state: RootState) => void) => void
export type BaseGetter = () => RootState

export type RootState = {
  document: NodePen.Document,
  camera: CameraState
  registry: {
    canvasRoot: React.RefObject<HTMLDivElement>
  }
}

type RootDispatch = {
  dispatch: CameraDispatch
}

type RootStore = RootState & RootDispatch
  // const elements: Element[] = [
  //   {

  //   }
  // ]
const initialState: Pick<RootState, 'document' | 'registry'> = {
  document: {
    id: 'id',
    elements: {
      'test-element-id': {
        id: 'test-element-id',
        template: 'test-template-id',
        position: {
          x: 5,
          y: -5
        },
        dimensions: {
          width: 20,
          height: 20,
        }
      }
    },
    library: {},
    version: 1
  },
  /** Collection of client-only references to meaningful dom elements */
  registry: {
    canvasRoot: React.createRef<HTMLDivElement>()
  }
}

export const useStore = create<RootStore>(
  immer((set, get) => ({
    ...initialState,
    [camera.key]: camera.initialState,
    dispatch: {
      ...camera.createDispatch(set, get)
    }
  }))
)