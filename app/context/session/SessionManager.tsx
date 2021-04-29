import React, { useMemo, useEffect } from 'react'
import { context as Context } from './state/context'
import { SessionStore } from './types'
import { newGuid } from '@/utils'
import { useQuery } from '@apollo/client'
import { USER_SESSION } from '@/queries'

type SessionManagerProps = {
  children?: React.ReactNode
}

export const SessionManager = ({ children }: SessionManagerProps): React.ReactElement => {
  // TODO: Figure out auth at some point
  const id = useMemo(() => (process.browser ? window?.localStorage?.getItem('np:alpha:user') ?? newGuid() : ''), [])

  const { data } = useQuery(USER_SESSION, { variables: { id } })

  useEffect(() => {
    window.localStorage.setItem('np:alpha:user', id)
  }, [])

  const session: SessionStore = {
    user: {
      id,
      token: '',
      name: 'chuck',
    },
    session: {
      id: data?.getUser?.session,
    },
  }

  return <Context.Provider value={session}>{children}</Context.Provider>
}
