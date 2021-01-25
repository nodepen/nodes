import React, { useEffect, useReducer } from 'react'
import { useSessionManager } from '@/context/session'
import { context as Context, initial, reducer } from './state'

type SceneManagerProps = {
  children?: React.ReactNode
}

export const SceneManager = ({ children }: SceneManagerProps): React.ReactElement => {
  const { io } = useSessionManager()

  const [store, dispatch] = useReducer(reducer, initial)

  const onStorageChange = (e: StorageEvent): void => {
    console.log(e)
  }

  useEffect(() => {
    window.addEventListener('storage', onStorageChange)

    return () => {
      window.removeEventListener('storage', onStorageChange)
    }
  })

  useEffect(() => {
    // Register socket events
  }, [])

  const value = { store, dispatch }

  return <Context.Provider value={value}>{children}</Context.Provider>
}
