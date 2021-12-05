import React, { useEffect } from 'react'
import { useSessionManager } from '../common/context/session'

/**
 * Home page for authenticated visits
 */
const HomePageDashboard = (): React.ReactElement => {
  const { user } = useSessionManager()

  useEffect(() => {}, [])

  return (
    <div>
      <h1>Welcome back {user?.displayName}</h1>
      <a href="/gh">Launch</a>
    </div>
  )
}

export default React.memo(HomePageDashboard)
