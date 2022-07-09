import type {
  GetState,
  SetState,
  State,
  StateCreator,
  StoreApi,
} from 'zustand'
import { produce } from 'immer'
import type { Draft } from 'immer'

export const withImmer = <
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
): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> => {
  return (set, get, api) => {
    const setWithImmer: Parameters<typeof config>[0] = (partial, replace) => {
      const nextState = typeof partial === 'function'
        ? produce(partial as (state: Draft<T>) => T)
        : (partial as T)

      return set(nextState, replace)
    }

    return config(setWithImmer, get, api)
  }
}
