import React from 'react'
import { useSessionManager } from '@/context/session'
import { useGraphManager } from '@/context/graph'

export const QueueContainer = (): React.ReactElement => {
  const { session, user } = useSessionManager()
  const { store, dispatch } = useGraphManager()

  const pokeSolution = (): void => {
    dispatch({ type: 'session/expire-solution' })
  }

  return (
    <main className="w-full flex flex-col">
      <p>session: {session?.id}</p>
      <p>user: {user?.id}</p>
      <p>library: {Object.keys(store.library)}</p>
      <button onClick={pokeSolution}>GO!</button>
    </main>
  )
}
