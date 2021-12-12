import { useRouter } from 'next/router'
import React from 'react'
import { ApolloContext } from '../common/context/apollo'
import { useSessionManager } from '../common/context/session'
import { firebase } from 'features/common/context/session/auth/firebase'
import { GraphList } from './components'

/**
 * Home page for authenticated visits
 */
const HomePageDashboard = (): React.ReactElement => {
  const router = useRouter()

  const { user, token } = useSessionManager()

  const handleSignOut = (): void => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        router.push('/')
      })
  }

  return (
    <ApolloContext token={token}>
      <>
        <div>
          <h1>Welcome back {user?.displayName}</h1>
          <a href="/gh">Launch</a>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
        <GraphList />
      </>
    </ApolloContext>
  )
}

export default React.memo(HomePageDashboard)
