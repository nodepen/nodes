import { useContext } from 'react'
import { SessionStore } from './types/SessionStore'
import { context } from './state/context'

export const useSessionManager = (): SessionStore => {
  const store = useContext(context)
  return store
}
