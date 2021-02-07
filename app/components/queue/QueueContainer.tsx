import React from 'react'
import { useSessionManager } from '@/context/session'

export const QueueContainer = (): React.ReactElement => {
  const { session, user } = useSessionManager()

  return (
    <main className="w-full flex flex-col">
      <p>{session?.id}</p>
      <p>{user?.id}</p>
    </main>
  )
}
