import React, { createContext } from 'react'
import { SessionStore } from './types'
import { useAuthentication } from './hooks/useAuthentication'
import { useDeviceConfiguration } from './hooks/useDeviceConfiguration'

export const SessionContext = createContext<SessionStore>({
  isAuthenticated: false,
  device: { iOS: false, breakpoint: 'sm' },
})

type SessionManagerProps = {
  children?: JSX.Element
}

export const SessionManager = ({ children }: SessionManagerProps): React.ReactElement => {
  const { user, userRecord, token } = useAuthentication()

  const { iOS, breakpoint } = useDeviceConfiguration()

  // const { id, initialize } = useSession(user?.uid)

  const isAuthenticated = !!token

  const session: SessionStore = {
    user,
    userRecord,
    token,
    isAuthenticated,
    device: {
      breakpoint,
      iOS,
    },
  }

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}
