import React, { useState, useEffect, createContext, useCallback } from 'react'
import { firebase } from './auth/firebase'
import nookies from 'nookies'
import { SessionStore } from './types'

export const SessionContext = createContext<SessionStore>({ device: { iOS: false, breakpoint: 'sm' } })

type SessionManagerProps = {
  children?: JSX.Element
}

export const SessionManager = ({ children }: SessionManagerProps): React.ReactElement => {
  const [user, setUser] = useState<SessionStore['user']>(undefined)
  const [token, setToken] = useState<string>()
  const [iOS, setIOS] = useState(false)

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

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then((res) => {
        if (res.user) {
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

  useEffect(() => {
    if (['iPhone', 'iPod', 'iPad'].includes(process.browser ? navigator.platform : '')) {
      setIOS(true)
    }
  }, [])

  const [breakpoint, setBreakpoint] = useState<SessionStore['device']['breakpoint']>('sm')

  const handleResize = useCallback((): void => {
    const size: SessionStore['device']['breakpoint'] = window.innerWidth < 750 ? 'sm' : 'md'

    if (breakpoint !== size) {
      setBreakpoint(size)
    }
  }, [breakpoint])

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  useEffect(() => {
    handleResize()
  }, [])

  const session: SessionStore = {
    user,
    token,
    session: 'unset',
    device: {
      breakpoint,
      iOS,
    },
  }

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}
