import React from 'react'
import { useSessionManager } from '../common/context/session'

/**
 * Home page for authenticated visits
 */
const HomePageDashboard = (): React.ReactElement => {
  const { user } = useSessionManager()

  return <div>Welcome back {user?.displayName}</div>
}

export default React.memo(HomePageDashboard)
