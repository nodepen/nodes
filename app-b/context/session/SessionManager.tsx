import React, { useState, useEffect, createContext } from 'react'
import { firebase } from './auth/firebase'
import nookies from 'nookies'
import { SessionStore } from './types'
import { gql, useApolloClient } from '@apollo/client'

const SessionContext = createContext<SessionStore>({})

type SessionManagerProps = {
  children?: JSX.Element
}

export const SessionManager = ({ children }: SessionManagerProps): React.ReactElement => {
  const [user, setUser] = useState<SessionStore['user']>(undefined)
  const [token, setToken] = useState<string>()

  const client = useApolloClient()

  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (u) => {
      if (!u) {
        const anon = await firebase.auth().signInAnonymously()

        if (!anon.user) {
          // Handle this failure gracefully
          setToken(undefined)
          nookies.set(undefined, 'token', '', { path: '/' })
          return
        }

        setUser(anon.user)

        const token = await anon.user.getIdToken()

        setToken(token)
        nookies.set(undefined, 'token', token, { path: '/' })
      } else {
        const token = await u.getIdToken()
        setUser(u)

        setToken(token)
        nookies.set(undefined, 'token', token, { path: '/' })
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
    client
      .query({
        query: gql`
          query {
            getInstalledComponents {
              guid
            }
          }
        `,
      })
      .then((res) => {
        console.log({ result: res })
      })
      .catch((err) => {
        console.error(err)
      })
  }, [client, token])

  // console.log(token)
  // console.log(user?.uid)

  return <SessionContext.Provider value={{ user, session: '...' }}>{children}</SessionContext.Provider>
}
