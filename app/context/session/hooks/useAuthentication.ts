import { useState, useEffect } from 'react'
import nookies from 'nookies'

import { auth } from '../auth/firebase'
import { User, onIdTokenChanged, signInAnonymously, getRedirectResult } from 'firebase/auth'

type AuthContext = {
  token?: string
  user?: User
}

export const useAuthentication = (): AuthContext => {
  const [user, setUser] = useState<User>()
  const [token, setToken] = useState<string>()

  useEffect(() => {
    return onIdTokenChanged(auth, async (u) => {
      nookies.destroy(undefined, 'token')

      if (!u) {
        const anon = await signInAnonymously(auth)

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
      const u = auth.currentUser
      await u?.getIdToken(true)
    }, 1000 * 60 * 10)

    return () => clearInterval(handleRefresh)
  }, [])

  useEffect(() => {
    getRedirectResult(auth)
      .then((res) => {
        if (res?.user) {
          setUser(res.user)
          return res.user.getIdToken()
        }
      })
      .then((token) => {
        if (token) {
          setToken(token)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return { user, token }
}
