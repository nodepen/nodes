import { useState, useEffect } from 'react'
import nookies from 'nookies'

import { firebase } from '../auth/firebase'
import { UserRecord } from '../types'

type AuthContext = {
  token?: string
  user?: firebase.User
  userRecord?: UserRecord
}

export const useAuthentication = (initialToken?: string): AuthContext => {
  const [context, setContext] = useState<AuthContext>({ token: initialToken })

  // const [user, setUser] = useState<firebase.User>()
  // const [userRecord, setUserRecord] = useState<UserRecord>()
  // const [token, setToken] = useState<string | undefined>(initialToken)

  useEffect(() => {
    firebase.auth().setPersistence('local')

    return firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        if (initialToken) {
          return
        }

        nookies.destroy(undefined, 'token', { path: '/' })

        firebase.auth().signInAnonymously()
      } else {
        const token = await user.getIdToken()

        if (user.isAnonymous) {
          // Set token in memory but not in cookies
          setContext({ token, user })
          return
        }

        nookies.set(undefined, 'token', token, { path: '/' })

        // Get user usage/limits, which will create record on api if first visit
        const userResponse = await fetch('/api/currentUser')
        const userRecord: UserRecord = await userResponse.json()

        setContext({ token, user, userRecord })

        // Update displayName, if somehow they don't match
        // Example: First third-party auth through 'sign in' instead of 'sign up' accidentally
        if (!user.displayName || user.displayName !== userRecord.username) {
          await user.updateProfile({ displayName: userRecord.username })
        }
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

  return context
}
