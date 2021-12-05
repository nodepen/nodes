import React from 'react'
import { ApolloContext } from '../common/context/apollo'
import { useSessionManager } from '../common/context/session'
import { GraphList } from './components'

/**
 * Home page for authenticated visits
 */
const HomePageDashboard = (): React.ReactElement => {
  const { user, token } = useSessionManager()

  return (
    <ApolloContext token={token}>
      <>
        <div>
          <h1>Welcome back {user?.displayName}</h1>
          <a href="/gh">Launch</a>
        </div>
        <GraphList />
      </>
    </ApolloContext>
  )
}

export default React.memo(HomePageDashboard)
