import { useState, useCallback, useEffect } from 'react'
import { newGuid } from 'features/graph/utils'

type SessionContext = {
  id?: string
  initialize: (userId: string, graphId: string) => Promise<void>
}

export const useSession = (uid?: string): SessionContext => {
  const [sessionId, setSessionId] = useState<string>()

  const initialize = useCallback(async (_userId: string, _graphId: string): Promise<void> => {
    // TODO: Do sessions need to persist at all?
    // - yes, so the model view knows what the current session is
    setSessionId(newGuid())
    return
  }, [])

  useEffect(() => {
    if (!uid) {
      return
    }

    initialize(uid, 'generic')
  }, [uid, initialize])

  return { id: sessionId, initialize }
}
