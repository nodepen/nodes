import React, { useState, useEffect, createContext } from 'react'
import { firebase } from './auth/firebase'
import nookies from 'nookies'
import { SessionStore } from './types'

export const SessionContext = createContext<SessionStore>({})

type SessionManagerProps = {
  children?: JSX.Element
}

export const SessionManager = ({ children }: SessionManagerProps): React.ReactElement => {
  const [user, setUser] = useState<SessionStore['user']>(undefined)
  const [token, setToken] = useState<string>()

  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (u) => {
      nookies.destroy(undefined, 'token')

      if (!u) {
        const anon = await firebase.auth().signInAnonymously()

        if (!anon.user) {
          // Handle this failure gracefully
          nookies.set(undefined, 'token', '', { path: '/' })
          setToken(undefined)
          return
        }

        const token = await anon.user.getIdToken()

        nookies.set(undefined, 'token', token, { path: '/' })

        setUser(anon.user)
        setToken(token)
      } else {
        const token = await u.getIdToken()

        nookies.set(undefined, 'token', token, { path: '/' })

        setUser(u)
        setToken(token)
      }
    })
  }, [])

  useEffect(() => {
    const handleRefresh = setInterval(async () => {
      const u = firebase.auth().currentUser
      await u?.getIdToken(true)
    }, 1000 * 60 * 10)

    return () => clearInterval(handleRefresh)
  }, [])

  return <SessionContext.Provider value={{ user, token, session: '...' }}>{children}</SessionContext.Provider>
}
