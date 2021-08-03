import { useState, useCallback } from 'react'
import { newGuid } from 'features/graph/utils'

type SessionContext = {
  id?: string
  initialize: (userId: string, graphId: string) => Promise<void>
}

export const useSession = (): SessionContext => {
  const [sessionId, setSessionId] = useState<string>()

  const initialize = useCallback(async (_userId: string, _graphId: string): Promise<void> => {
    // TODO: Do sessions need to persist at all?
    setSessionId(newGuid())
    return
  }, [])

  return { id: sessionId, initialize }
}
