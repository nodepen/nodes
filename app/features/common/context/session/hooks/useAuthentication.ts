import { useState, useEffect } from 'react'
import nookies from 'nookies'

import { firebase } from '../auth/firebase'
import { UserRecord } from '../types'

type AuthContext = {
  token?: string
  user?: firebase.User
  userRecord?: UserRecord
}

export const useAuthentication = (): AuthContext => {
  const [user, setUser] = useState<firebase.User>()
  const [userRecord, setUserRecord] = useState<UserRecord>()
  const [token, setToken] = useState<string>()

  useEffect(() => {
    firebase.auth().setPersistence('local')

    return firebase.auth().onIdTokenChanged(async (u) => {
      if (!u) {
        nookies.destroy(undefined, 'token')

        setUser(undefined)
        setUserRecord(undefined)
        setToken(undefined)
      } else {
        const token = await u.getIdToken()

        nookies.set(undefined, 'token', token, { path: '/' })

        setUser(u)
        setToken(token)

        if (u.isAnonymous) {
          return
        }

        // Get user usage/limits, which will create record on api if first visit
        const userResponse = await fetch('/api/currentUser')
        const userData: UserRecord = await userResponse.json()

        setUserRecord(userData)
      }
    })
  }, [])

  useEffect(() => {
    const handleRefresh = setInterval(async () => {
      const u = firebase.auth().currentUser
      await u?.getIdToken(true)
    }, 1000 * 60 * 60)

    return () => clearInterval(handleRefresh)
  }, [])

  return { user, userRecord, token }
}
