import React, { useRef, useEffect } from 'react'
import { useStore } from '$'
import type { NodesAppStore } from '$'

/**
 * Given a store selector, provide a stable reference to that state value.
 * @remarks Utilizes native zustand `subscribe` to prevent renders on state changes.
 * @param selector
 */
export const useStoreRef = <T>(selector: (store: NodesAppStore) => T): React.MutableRefObject<T> => {
  // Initialize ref with value at time of first hook call
  const ref = useRef<T>(selector(useStore.getState()))

  // Subscribe to state with provided selector callback
  useEffect(() => {
    const unsubscribe = useStore.subscribe((state) => {
      ref.current = selector(state)
    })

    return unsubscribe
  })

  return ref
}
