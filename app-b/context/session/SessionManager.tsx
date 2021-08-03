import React, { createContext } from 'react'
import { SessionStore } from './types'
import { gql, useSubscription } from '@apollo/client'
import { useAuthentication } from './hooks/useAuthentication'
import { useDeviceConfiguration } from './hooks/useDeviceConfiguration'

export const SessionContext = createContext<SessionStore>({ device: { iOS: false, breakpoint: 'sm' } })

type SessionManagerProps = {
  children?: JSX.Element
}

export const SessionManager = ({ children }: SessionManagerProps): React.ReactElement => {
  const { user, token } = useAuthentication()

  const { iOS, breakpoint } = useDeviceConfiguration()

  const { data, error } = useSubscription(
    gql`
      subscription OnSolution($id: String!) {
        onSolution(solutionId: $id) {
          solutionId
        }
      }
    `,
    {
      variables: {
        id: 'okay',
      },
      skip: !token,
      shouldResubscribe: true,
    }
  )

  if (data) {
    console.log(`Subscription still active! [ ${data.onSolution.solutionId} ]`)
  }

  if (error) {
    console.error(`${error.name} : ${error.message}`)
  }

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
