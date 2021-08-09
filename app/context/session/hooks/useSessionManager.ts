import { useContext } from 'react'
import { SessionContext } from '../SessionManager'
import { SessionStore } from '../types'

export const useSessionManager = (): SessionStore => {
  return useContext(SessionContext)
}
