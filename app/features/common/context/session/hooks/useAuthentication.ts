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
        // nookies.destroy(undefined, 'token')
        // const anon = await firebase.auth().signInAnonymously()
        // if (!anon.user) {
        //   // Handle this failure gracefully
        //   nookies.set(undefined, 'token', '', { path: '/' })
        //   setToken(undefined)
        //   return
        // }
        // const token = await anon.user.getIdToken()
        // nookies.set(undefined, 'token', token, { path: '/' })
        // setUser(anon.user)
        // setToken(token)
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

        if (process.env.NEXT_PUBLIC_DEBUG) {
          console.log(userData)
        }

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

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then((res) => {
        if (res.user) {
          if (!res.user.isAnonymous) {
            if (window.location.toString().includes('/signup') || window.location.toString().includes('/signin')) {
              window.location.assign('/')
            }
          }
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

  return { user, userRecord, token }
}
